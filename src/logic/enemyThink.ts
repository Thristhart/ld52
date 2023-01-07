import { EnemyState, GameState, PathNodeType } from "~/models/gameStateDescription";
import { defendPoint } from "~/models/level";
import { pathToPoint } from "./pathfinding";

const enemySpeed = 1;

// TODO: weight pathfinding by nearby towers
// TODO: display every enemy's path

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
    const nextTarget = path[0];
    if (!nextTarget) {
        console.log("finished path");
        gameState.enemies[entId].type = 0;
        path[0].type = PathNodeType.Empty;
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
};
