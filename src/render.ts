import { getGameState } from "./gameWorkerWrapper";
import { levelData, levelHeight, levelWidth } from "./models/level";
import { drawTiles, tileSize } from "./render/drawTile";

export const canvas = document.querySelector("canvas") as HTMLCanvasElement;
const context = canvas.getContext("2d");
if (!context) {
    throw new Error("somehow couldn't get a 2d context");
}

let frameHandle: number;
export const animationFrame = async (_timestamp: number) => {
    const state = await getGameState();
    canvas.width = tileSize * levelWidth;
    canvas.height = tileSize * levelHeight;

    context.save();

    context.imageSmoothingEnabled = false;
    for (let x = 0; x < levelWidth; x++) {
        for (let y = 0; y < levelHeight; y++) {
            drawTiles(context, levelData[y][x], x, y, state.season);
        }
    }

    context.restore();

    frameHandle = requestAnimationFrame(animationFrame);
};

export const setupRender = () => {
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
