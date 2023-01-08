import { Enemy, GameState, PathNodeType } from "~/models/gameStateDescription";
import { defendPoint } from "~/models/level";
import { pathToPoint } from "./pathfinding";

const enemySpeed = 1;
const enemyDamage = 1;

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
