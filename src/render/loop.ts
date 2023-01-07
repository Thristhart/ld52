import { getGameState } from "~/gameWorkerWrapper";
import { Direction } from "~/models/direction";
import { levelBackground, levelHeight, levelWidth } from "~/models/level";
import { drawEnemy } from "./drawEnemies";
import { tileSize } from "./drawTile";

export const canvas = document.querySelector("canvas") as HTMLCanvasElement;
const context = canvas.getContext("2d");
if (!context) {
    throw new Error("somehow couldn't get a 2d context");
}

let frameHandle: number;
export const animationFrame = async (timestamp: number) => {
    const state = await getGameState();
    canvas.width = tileSize * levelWidth;
    canvas.height = tileSize * levelHeight;

    context.save();

    context.imageSmoothingEnabled = false;
    context.drawImage(levelBackground, 0, 0);

    state.enemies.forEach((enemy) => {
        drawEnemy(context, enemy.x, enemy.y, enemy.type, timestamp, Direction.Right);
    });

    context.restore();

    frameHandle = requestAnimationFrame(animationFrame);
};

export const startLoop = () => {
    frameHandle = requestAnimationFrame(animationFrame);
};

if (import.meta.hot) {
    import.meta.hot.accept((newModule) => {
        if (newModule) {
            cancelAnimationFrame(frameHandle);
            frameHandle = requestAnimationFrame(newModule.animationFrame);
        }
    });
}
