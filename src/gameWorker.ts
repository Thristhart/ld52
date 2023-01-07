import BufferBackedObject, { structSize } from "buffer-backed-object/buffer-backed-object";
import { GameStateDescription } from "~/models/gameStateDescription";
import { enemyThink } from "./logic/enemyThink";
import { towerThink } from "./logic/towerThink";
import { EnemyType } from "./models/enemies";
import { spawnPoint, tileSize } from "./models/level";
import { TowerType } from "./models/towers";

export const gameStateBuffer = new ArrayBuffer(structSize(GameStateDescription));
const gameState = new BufferBackedObject(gameStateBuffer, GameStateDescription);

export const placeTower = (type: TowerType, gridX: number, gridY: number) => {
    const container = gameState.towers.find((tower) => tower.type === TowerType.None);
    if (!container) {
        console.error("No room for another tower!");
        return;
    }
    container.type = type;
    container.x = gridX * tileSize;
    container.y = gridY * tileSize;
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

async function doGameLogic(timestamp: number) {
    for (let i = 0; i < gameState.enemies.length; i++) {
        const enemy = gameState.enemies[i];
        if (!enemy.type) {
            continue;
        }
        await enemyThink(gameState, i, enemy);
    }
    for (let i = 0; i < gameState.towers.length; i++) {
        const tower = gameState.towers[i];
        if (!tower.type) {
            continue;
        }
        await towerThink(gameState, i, tower, timestamp);
    }
}

function addEnemy(type: EnemyType, x: number, y: number) {
    const container = gameState.enemies.find((enemy) => enemy.type === EnemyType.None);
    if (!container) {
        console.error("No room for another enemy!");
        return;
    }
    container.type = type;
    container.x = x;
    container.y = y;
}

function setup() {
    addEnemy(EnemyType.Slime, spawnPoint.x, spawnPoint.y);
    tick();
    gameState.playerHealth = 100;
}

setup();

// TODO: spawn enemies regularly
// TODO: enemies do damage when they reach the end
