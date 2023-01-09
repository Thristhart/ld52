import { Circle, Rectangle } from "@timohausmann/quadtree-ts";
import { enemyThink } from "./logic/enemyThink";
import { gameState } from "./logic/gameState";
import { projectileThink } from "./logic/projectileThink";
import { enemyQuadtree, towerQuadtree } from "./logic/quadtree";
import { towerThink } from "./logic/towerThink";
import { EnemyType } from "./models/enemies";
import { AOEType } from "./models/gameStateDescription";
import { spawnPoint, tileSize } from "./models/level";
import { nextSeason } from "./models/season";
import { grapeAOEDuration, towerCosts, TowerType } from "./models/towers";

export function getGameState() {
    return gameState;
}

let lastTowerId = -1;
export const placeTower = (type: TowerType, gridX: number, gridY: number) => {
    if (gameState.currency >= towerCosts[type]) {
        gameState.currency -= towerCosts[type];
        gameState.towers.push({
            type,
            x: gridX * tileSize,
            y: gridY * tileSize,
            id: lastTowerId++,
            lastGrowthTime: performance.now(),
            growthStage: 0,
            lastShootTime: 0,
            kills: 0,
        });
    }
};

const millisecondsPerTick = 16;

let lastTickTime = performance.now();
async function tick() {
    const now = performance.now();
    let dt = now - lastTickTime;
    while (dt >= millisecondsPerTick) {
        lastTickTime = now;
        await doGameLogic(now);
        dt -= millisecondsPerTick;
    }
}

let lastEnemyTime = 0;
let lastSeasonTime = 0;

const timePerSeason = 300000;

const timePerEnemy = 500;

async function doGameLogic(timestamp: number) {
    towerQuadtree.clear();
    enemyQuadtree.clear();
    for (let i = 0; i < gameState.enemies.length; i++) {
        const enemy = gameState.enemies[i];
        if (!enemy.type) {
            continue;
        }
        enemyQuadtree.insert(
            new Circle({
                x: enemy.x,
                y: enemy.y,
                r: 8,
                data: enemy.id,
            })
        );
    }
    for (let i = 0; i < gameState.towers.length; i++) {
        const tower = gameState.towers[i];
        if (!tower.type) {
            continue;
        }
        towerQuadtree.insert(
            new Rectangle({
                x: tower.x - tileSize * 1.5,
                y: tower.y - tileSize * 1.5,
                width: tileSize * 3,
                height: tileSize * 3,
                data: tower.id,
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
        await towerThink(gameState, tower, timestamp);
    }
    for (let i = 0; i < gameState.projectiles.length; i++) {
        const projectile = gameState.projectiles[i];
        if (!projectile.type) {
            continue;
        }
        await projectileThink(gameState, projectile, timestamp);
    }
    for (let i = 0; i < gameState.aoes.length; i++) {
        const projectile = gameState.aoes[i];
        if (!projectile.type) {
            continue;
        }
        if (projectile.type === AOEType.Grape) {
            if (timestamp - projectile.startTimestamp > grapeAOEDuration) {
                gameState.aoes.splice(i, 1);
            }
        }
    }

    if (timestamp - lastEnemyTime > timePerEnemy) {
        addEnemy(EnemyType.Slime, spawnPoint.x, spawnPoint.y);
        lastEnemyTime = timestamp;
    }

    if (timestamp - lastSeasonTime > timePerSeason) {
        gameState.season = nextSeason(gameState.season);
        lastSeasonTime = timestamp;
    }

    gameState.gametime = timestamp;
}

let lastEntId = -1;

function addEnemy(type: EnemyType, x: number, y: number) {
    gameState.enemies.push({
        x,
        y,
        type,
        health: 10,
        id: lastEntId++,
        path: [],
    });
}

function setup() {
    lastEnemyTime = performance.now();
    addEnemy(EnemyType.Slime, spawnPoint.x, spawnPoint.y);
    gameState.playerHealth = 100;
    gameState.currency = 50;

    setInterval(tick);
}

setup();
