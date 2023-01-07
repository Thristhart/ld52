import { EnemyState, GameState } from "~/models/gameStateDescription";
import { defendPoint } from "~/models/level";
import { pathToPoint, Point } from "./pathfinding";

const PathfindingCache: Array<Array<Point>> = [];

const enemySpeed = 1;

export const enemyThink = async (gameState: GameState, entId: number, enemy: EnemyState) => {
    const path = PathfindingCache[entId] ?? pathToPoint(enemy, defendPoint);
    if (path) {
        const nextTarget = path[0];
        if (!nextTarget) {
            console.log("finished path");
            gameState.enemies[entId].type = 0;
            delete PathfindingCache[entId];
            return;
        }
        const dx = nextTarget.x - enemy.x;
        const dy = nextTarget.y - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < enemySpeed * 1.2) {
            path.shift();
        } else {
            enemy.x += (dx / distance) * enemySpeed;
            enemy.y += (dy / distance) * enemySpeed;
        }
    }
    PathfindingCache[entId] = path;
};
