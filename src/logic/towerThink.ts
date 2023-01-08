import { Circle } from "@timohausmann/quadtree-ts";
import { GameState, Tower } from "~/models/gameStateDescription";
import { ProjectileType } from "~/models/projectile";
import { TowerType } from "~/models/towers";
import { enemyQuadtree } from "./quadtree";

const growthDuration = 600;

const cornFireDuration = 250;
const cornFireRadius = 100;

function circleCollision(circleA: Circle<unknown>, circleB: Circle<unknown>) {
    const dx = circleA.x - circleB.x;
    const dy = circleA.y - circleB.y;
    return Math.sqrt(dx * dx + dy * dy) < circleA.r + circleB.r;
}

export async function towerThink(gameState: GameState, tower: Tower, timestamp: number) {
    switch (tower.type) {
        case TowerType.Corn:
            if (tower.growthStage < 5) {
                if (timestamp - tower.lastGrowthTime > growthDuration) {
                    tower.growthStage++;
                    tower.lastGrowthTime = timestamp;
                }
                return;
            }
            if (timestamp - tower.lastShootTime > cornFireDuration) {
                const firingBounds = new Circle<number>({ x: tower.x, y: tower.y, r: cornFireRadius });
                const potentialEnemies = enemyQuadtree
                    .retrieve(firingBounds)
                    .filter((enemy) => circleCollision(enemy, firingBounds))
                    .sort((a, b) => a.y - b.y);

                if (potentialEnemies[0]?.data) {
                    gameState.projectiles.push({
                        sourceId: tower.id,
                        targetId: potentialEnemies[0].data,
                        type: ProjectileType.Corn,
                        startTimestamp: timestamp,
                    });
                }
            }
            break;
    }
}
