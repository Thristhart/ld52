import { Circle } from "@timohausmann/quadtree-ts";
import { AOEType, GameState, Tower } from "~/models/gameStateDescription";
import { cornProjectileDuration, ProjectileType } from "~/models/projectile";
import { TowerType } from "~/models/towers";
import { damageEnemy, predictEnemyLocation } from "./enemyThink";
import { enemyQuadtree } from "./quadtree";

const growthDuration = 600;

const cornFireDuration = 1000;
const cornFireRadius = 100;

const grapeFireDuration = 2000;
const grapeFireRadius = 48;

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
                    .sort((a, b) => b.y - a.y);

                if (potentialEnemies[0]?.data !== undefined) {
                    const enemy = gameState.enemies.find((enemy) => enemy.id === potentialEnemies[0].data);
                    const futureEnemyPosition = predictEnemyLocation(enemy, cornProjectileDuration);
                    gameState.projectiles.push({
                        sourceId: tower.id,
                        targetId: potentialEnemies[0].data,
                        type: ProjectileType.Corn,
                        startTimestamp: timestamp,
                        targetPoint: futureEnemyPosition,
                    });
                    tower.lastShootTime = timestamp;
                }
            }
            break;
        case TowerType.Grape:
            if (tower.growthStage < 5) {
                if (timestamp - tower.lastGrowthTime > growthDuration) {
                    tower.growthStage++;
                    tower.lastGrowthTime = timestamp;
                }
                return;
            }

            if (timestamp - tower.lastShootTime > grapeFireDuration) {
                const firingBounds = new Circle<number>({ x: tower.x, y: tower.y, r: grapeFireRadius });
                const potentialEnemies = enemyQuadtree
                    .retrieve(firingBounds)
                    .filter((enemy) => circleCollision(enemy, firingBounds));

                if (potentialEnemies.length > 0) {
                    for (const enemyLocation of potentialEnemies) {
                        const enemy = gameState.enemies.find((enemy) => enemy.id === enemyLocation.data);
                        if (enemy) {
                            damageEnemy(gameState, enemy, 5);
                        }
                    }
                    gameState.aoes.push({
                        type: AOEType.Grape,
                        startTimestamp: timestamp,
                        x: tower.x,
                        y: tower.y,
                        radius: grapeFireRadius,
                    });
                    tower.lastShootTime = timestamp;
                }
            }
            break;
    }
}
