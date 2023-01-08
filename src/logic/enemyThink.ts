import { EnemyState, GameState, PathNodeType } from "~/models/gameStateDescription";
import { defendPoint } from "~/models/level";
import { removeFromBufferBasedArray } from "~/removeFromBufferBasedArray";
import { pathToPoint } from "./pathfinding";

const enemySpeed = 10;
const enemyDamage = 1;

// TODO: weight pathfinding by nearby towers

export const enemyThink = async (gameState: GameState, entId: number, enemy: EnemyState) => {
    const path = enemy.path;
    if (path[0].type === PathNodeType.Empty) {
        const newPath = pathToPoint(enemy, defendPoint);
        for (let i = 0; i < newPath.length; i++) {
            path[i].type = PathNodeType.Upcoming;
            path[i].x = newPath[i].x;
            path[i].y = newPath[i].y;
        }
    }
    const nextTargetIndex = path.findIndex((item) => item.type === PathNodeType.Upcoming);
    if (nextTargetIndex == -1) {
        console.log("finished path");
        gameState.playerHealth -= enemyDamage;
        removeFromBufferBasedArray(gameState.enemies, entId);
        return;
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
};

function distanceFromDistances(dx: number, dy: number) {
    return Math.sqrt(dx * dx + dy * dy);
}
