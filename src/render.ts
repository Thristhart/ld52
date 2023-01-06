import { getGameState } from "~/gameWorkerWrapper";

export const canvas = document.querySelector("canvas") as HTMLCanvasElement;
const context = canvas.getContext("2d");
if (!context) {
    throw new Error("somehow couldn't get a 2d context");
}

let frameHandle: number;
export const animationFrame = async (_timestamp: number) => {
    const state = await getGameState();
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    context.font = "bold 48px serif";
    context.fillText(`Click count: ${state.counterValue.toString()}`, 10, 60);

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