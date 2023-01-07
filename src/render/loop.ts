import hutSheetPath from "~/assets/images/defendPoint.png";
import { getGameState } from "~/gameWorkerWrapper";
import { Direction } from "~/models/direction";
import { PathNodeType } from "~/models/gameStateDescription";
import { defendPoint, levelHeight, levelWidth, tileSize } from "~/models/level";
import { Season } from "~/models/season";
import { drawEnemy } from "./drawEnemies";
import { drawSprite, SpriteSheet } from "./drawSprite";
import { levelBackgrounds } from "./levelBg";
import { loadImage } from "./loadImage";

export const canvas = document.querySelector("canvas") as HTMLCanvasElement;
const context = canvas.getContext("2d");
if (!context) {
    throw new Error("somehow couldn't get a 2d context");
}

const hutSheet: SpriteSheet = {
    image: loadImage(hutSheetPath),
    spriteSize: 78,
};

function getHutVersion(season: Season) {
    switch (season) {
        case Season.Spring:
        case Season.Summer:
        case Season.Fall:
            return 0;
        case Season.Winter:
            return 1;
        default:
            return 0;
    }
}

let frameHandle: number;
export const animationFrame = async (timestamp: number) => {
    const state = await getGameState();
    canvas.width = tileSize * levelWidth;
    canvas.height = tileSize * levelHeight;

    context.save();

    context.imageSmoothingEnabled = false;
    context.drawImage(levelBackgrounds[state.season], 0, 0);

    state.enemies.forEach((enemy) => {
        if (enemy.path[0].type === PathNodeType.Empty) {
            return;
        }
        context.beginPath();
        context.moveTo(enemy.x, enemy.y);
        for (const pathNode of enemy.path) {
            if (pathNode.type === PathNodeType.Empty) {
                break;
            }
            if (pathNode.type === PathNodeType.Upcoming) {
                context.lineTo(pathNode.x, pathNode.y);
            }
        }
        context.stroke();
    });

    drawSprite(context, hutSheet, defendPoint.x, defendPoint.y - hutSheet.spriteSize / 2 + 6, [
        getHutVersion(state.season),
        0,
    ]);

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
