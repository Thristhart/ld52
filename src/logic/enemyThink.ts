import { lerp } from "~/lerp";
import { Enemy, GameState, PathNodeType } from "~/models/gameStateDescription";
import { defendPoint } from "~/models/level";
import { pathToPoint } from "./pathfinding";

const enemySpeed = 1;
const enemyDamage = 1;

export function predictEnemyLocation(enemy: Enemy | undefined, futureMilliseconds: number) {
    if (!enemy) {
        return { x: 0, y: 0 };
    }
    const path = enemy.path;
    if (path.length === 0 || path[0]?.type === PathNodeType.Empty) {
        return { x: enemy.x, y: enemy.y };
    }
    let futureX = enemy.x;
    let futureY = enemy.y;
    let remainingDuration = futureMilliseconds;
    let nextTargetIndex = path.findIndex((item) => item.type === PathNodeType.Upcoming);
    while (remainingDuration > 0) {
        const nextTarget = path[nextTargetIndex];
        nextTargetIndex++;
        if (!nextTarget) {
            return { x: futureX, y: futureY };
        }
        const dx = nextTarget.x - futureX;
        const dy = nextTarget.y - futureY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const timeToTravelDistance = distance / (enemySpeed / 18.5); // 16 milliseconds per tick, adjusted to 18.5 bc of imprecision
        if (timeToTravelDistance <= remainingDuration) {
            remainingDuration -= timeToTravelDistance;
            futureX = nextTarget.x;
            futureY = nextTarget.y;
        } else {
            const progress = remainingDuration / timeToTravelDistance;
            futureX = lerp(futureX, nextTarget.x, progress);
            futureY = lerp(futureY, nextTarget.y, progress);
            remainingDuration = 0;
        }
    }
    return { x: futureX, y: futureY };
}

export const enemyThink = async (gameState: GameState, enemy: Enemy) => {
    const path = enemy.path;
    if (path.length === 0 || path[0].type === PathNodeType.Empty) {
        const newPath = pathToPoint(enemy, defendPoint);
        for (let i = 0; i < newPath.length; i++) {
            path[i] = { type: PathNodeType.Upcoming, x: newPath[i].x, y: newPath[i].y };
        }
    }
    const nextTargetIndex = path.findIndex((item) => item.type === PathNodeType.Upcoming);
    if (nextTargetIndex == -1) {
        gameState.playerHealth -= enemyDamage;
        return -1;
    }
    const nextTarget = path[nextTargetIndex];
    const dx = nextTarget.x - enemy.x;
    const dy = nextTarget.y - enemy.y;
    const distance = distanceFromDistances(dx, dy);

    if (distance < enemySpeed * 1.2) {
        path[nextTargetIndex].type = PathNodeType.Visited;
    } else {
        enemy.x += (dx / distance) * enemySpeed;
        enemy.y += (dy / distance) * enemySpeed;
    }

    return 0;
};

function distanceFromDistances(dx: number, dy: number) {
    return Math.sqrt(dx * dx + dy * dy);
}
