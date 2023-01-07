import BufferBackedObject, { structSize } from "buffer-backed-object";
import { GameStateDescription } from "~/models/gameStateDescription";
import { EnemyType } from "./models/enemies";
import { nextSeason } from "./models/season";

export const gameStateBuffer = new ArrayBuffer(structSize(GameStateDescription));
const gameState = new BufferBackedObject(gameStateBuffer, GameStateDescription);

export const onClick = () => {
    gameState.season = nextSeason(gameState.season);
};

const millisecondsPerTick = 64;

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
    // console.log(gameState.enemies[0].x);
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
    addEnemy(EnemyType.Slime, 30, 30);
    tick();
}

setup();
