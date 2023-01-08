import { Circle, Rectangle } from "@timohausmann/quadtree-ts";
import { enemyThink } from "./logic/enemyThink";
import { entityQuadtree } from "./logic/quadtree";
import { towerThink } from "./logic/towerThink";
import { EnemyType } from "./models/enemies";
import { GameState } from "./models/gameStateDescription";
import { spawnPoint, tileSize } from "./models/level";
import { TowerType } from "./models/towers";

export const gameState: GameState = {
    gametime: 0,
    season: 0,
    playerHealth: 0,
    enemies: [],
    towers: [],
    projectiles: [],
};

let lastTowerId = -1;
export const placeTower = (type: TowerType, gridX: number, gridY: number) => {
    gameState.towers.push({
        type,
        x: gridX * tileSize,
        y: gridY * tileSize,
        id: lastTowerId++,
        lastGrowthTime: 0,
        growthStage: 0,
    });
};

const millisecondsPerTick = 16;

let lastTickTime = performance.now();
async function tick() {
    const now = performance.now();
    let dt = now - lastTickTime;
    while (dt > millisecondsPerTick) {
        lastTickTime = now;
        await doGameLogic(now);
        dt -= millisecondsPerTick;
    }
    setTimeout(tick, millisecondsPerTick - dt);
}

let lastEnemyTime = 0;

const timePerEnemy = 500;

async function doGameLogic(timestamp: number) {
    entityQuadtree.clear();
    for (let i = 0; i < gameState.enemies.length; i++) {
        const enemy = gameState.enemies[i];
        if (!enemy.type) {
            continue;
        }
        entityQuadtree.insert(
            new Circle({
                x: enemy.x,
                y: enemy.y,
                r: 8,
                data: {
                    type: "enemy",
                    id: enemy.id,
                },
            })
        );
    }
    for (let i = 0; i < gameState.towers.length; i++) {
        const tower = gameState.towers[i];
        if (!tower.type) {
            continue;
        }
        entityQuadtree.insert(
            new Rectangle({
                x: tower.x,
                y: tower.y,
                width: 16,
                height: 16,
                data: {
                    type: "tower",
                    id: tower.id,
                },
            })
        );
    }
    for (let i = 0; i < gameState.enemies.length; i++) {
        const enemy = gameState.enemies[i];
        if (!enemy.type) {
            continue;
        }
        const result = await enemyThink(gameState, enemy);
        if (result === -1) {
            gameState.enemies.splice(i, 1);
            i--;
        }
    }
    for (let i = 0; i < gameState.towers.length; i++) {
        const tower = gameState.towers[i];
        if (!tower.type) {
            continue;
        }
        await towerThink(gameState, i, tower, timestamp);
    }

    if (timestamp - lastEnemyTime > timePerEnemy) {
        addEnemy(EnemyType.Slime, spawnPoint.x, spawnPoint.y);
        lastEnemyTime = timestamp;
    }
}

let lastEntId = -1;

function addEnemy(type: EnemyType, x: number, y: number) {
    gameState.enemies.push({
        x,
        y,
        type,
        id: lastEntId++,
        path: [],
    });
}

function setup() {
    lastEnemyTime = performance.now();
    addEnemy(EnemyType.Slime, spawnPoint.x, spawnPoint.y);
    tick();
    gameState.playerHealth = 100;
}

setup();
