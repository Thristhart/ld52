import BufferBackedObject, { structSize } from "buffer-backed-object";
import { GameStateDescription } from "~/models/gameStateDescription";
import { enemyThink } from "./logic/enemyThink";
import { EnemyType } from "./models/enemies";
import { spawnPoint } from "./models/level";
import { nextSeason } from "./models/season";

export const gameStateBuffer = new ArrayBuffer(structSize(GameStateDescription));
const gameState = new BufferBackedObject(gameStateBuffer, GameStateDescription);

export const onClick = () => {
    gameState.season = nextSeason(gameState.season);
};

const millisecondsPerTick = 16;

let lastTickTime = performance.now();
function tick() {
    const now = performance.now();
    let dt = now - lastTickTime;
    while (dt > millisecondsPerTick) {
        lastTickTime = now;
        doGameLogic();
        dt -= millisecondsPerTick;
    }
    setTimeout(tick, millisecondsPerTick - dt);
}

function doGameLogic() {
    for (let i = 0; i < gameState.enemies.length; i++) {
        const enemy = gameState.enemies[i];
        if (!enemy.type) {
            continue;
        }
        enemyThink(i, enemy);
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
}

setup();
