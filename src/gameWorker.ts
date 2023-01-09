import { Circle, Rectangle } from "@timohausmann/quadtree-ts";
import { enemyThink } from "./logic/enemyThink";
import { gameState } from "./logic/gameState";
import { projectileThink } from "./logic/projectileThink";
import { enemyQuadtree, towerQuadtree } from "./logic/quadtree";
import { towerThink } from "./logic/towerThink";
import { Direction } from "./models/direction";
import { enemyHealthMaxes, EnemyType } from "./models/enemies";
import { AOEType } from "./models/gameStateDescription";
import { spawnPoint, tileSize } from "./models/level";
import { nextSeason, timePerSeason } from "./models/season";
import { grapeAOEDuration, moneyPerKill, towerCosts, towerRadiuses, TowerType } from "./models/towers";

export function getGameState() {
    return gameState;
}

let lastTowerId = -1;
export const placeTower = (type: TowerType, gridX: number, gridY: number, gametime: number) => {
    if (gameState.currency >= towerCosts[type]) {
        gameState.currency -= towerCosts[type];
        gameState.towers.push({
            type,
            x: gridX * tileSize + tileSize / 2,
            y: gridY * tileSize + tileSize / 2,
            id: lastTowerId++,
            lastGrowthTime: gametime,
            growthStage: 0,
            lastShootTime: 0,
            kills: 0,
        });
    }
};

export const sellTower = (towerId: number) => {
    const tower = gameState.towers.find((tower) => tower.id === towerId);
    if (!tower) {
        throw `Tried to sell non-existant tower ${towerId}`;
    }
    const value = tower.kills * moneyPerKill;
    gameState.towers.splice(gameState.towers.indexOf(tower), 1);
    gameState.currency += value;
};

const millisecondsPerTick = 16;

let startTimestamp = performance.now();
let lastTickTime = performance.now();
async function tick() {
    const now = performance.now();
    let dt = now - lastTickTime;
    while (dt >= millisecondsPerTick) {
        lastTickTime = now;
        await doGameLogic(now - startTimestamp);
        dt -= millisecondsPerTick;
    }
}

const oneSecond = 1000;
const oneMinute = oneSecond * 60;

let lastSlimeTime = 0;
let lastGolemTime = 0;
let lastSeasonTime = 0;

let timePerSlime = 1000;
let timePerGolem = 30 * oneSecond;

async function doGameLogic(timestamp: number) {
    if (gameState.playerHealth <= 0) {
        return;
    }
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
        const radius = towerRadiuses[tower.type];
        towerQuadtree.insert(
            new Rectangle({
                x: tower.x - radius,
                y: tower.y - radius,
                width: radius * 2,
                height: radius * 2,
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

    if (timestamp - lastSlimeTime > timePerSlime) {
        addEnemy(EnemyType.Slime, spawnPoint.x, spawnPoint.y);
        lastSlimeTime = timestamp;
    }

    if (golemsEnabled && timestamp - lastGolemTime > timePerGolem) {
        addEnemy(EnemyType.Golem, spawnPoint.x, spawnPoint.y);
        lastGolemTime = timestamp;
    }

    if (timestamp - lastSeasonTime > timePerSeason) {
        gameState.season = nextSeason(gameState.season);
        lastSeasonTime = timestamp;
    }

    progression(timestamp);

    gameState.gametime = timestamp;
}

let lastEntId = -1;

function addEnemy(type: EnemyType, x: number, y: number) {
    gameState.enemies.push({
        x,
        y,
        type,
        health: enemyHealthMaxes[type],
        direction: Direction.Down,
        id: lastEntId++,
        path: [],
    });
}

let golemsEnabled = false;

function progression(timestamp: number) {
    if (timestamp < oneSecond * 10) {
        return;
    }
    if (timestamp < oneMinute * 3) {
        timePerSlime = 1000 - (timestamp / (oneMinute * 3)) * 500;
    }
    // summer
    if (timestamp > timePerSeason) {
        golemsEnabled = true;
    }
}

export function setup() {
    startTimestamp = performance.now();
    lastTickTime = startTimestamp;
    setInterval(tick);
}
