import { levelHeight, levelWidth } from "./models/level";
import { Season } from "./models/season";
import { BasicTile, drawTile } from "./render/drawTile";

export const canvas = document.querySelector("canvas") as HTMLCanvasElement;
const context = canvas.getContext("2d");
if (!context) {
    throw new Error("somehow couldn't get a 2d context");
}

let frameHandle: number;
export const animationFrame = async (_timestamp: number) => {
    //const state = await getGameState();
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    context.save();

    context.imageSmoothingEnabled = false;
    for (let x = 0; x < levelWidth; x++) {
        for (let y = 0; y < levelHeight; y++) {
            drawTile(context, BasicTile, x, y, Season.Summer);
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
