import hutSheetPath from "~/assets/images/defendPoint.png";
import { getGameState } from "~/gameWorkerWrapper";
import { isHovering, towerHoverPosition } from "~/input";
import { lerp } from "~/lerp";
import { Direction } from "~/models/direction";
import { PathNodeType } from "~/models/gameStateDescription";
import { defendPoint, levelHeight, levelWidth, tileSize } from "~/models/level";
import { getProjectileProgress } from "~/models/projectile";
import { Season } from "~/models/season";
import { drawEnemy } from "./drawEnemies";
import { drawSprite, SpriteSheet } from "./drawSprite";
import { drawTower } from "./drawTower";
import { levelBackgrounds } from "./levelBg";
import { loadImage } from "./loadImage";

export const canvas = document.querySelector("canvas") as HTMLCanvasElement;
const context = canvas.getContext("2d");
if (!context) {
    throw new Error("somehow couldn't get a 2d context");
}

const hutSheet: SpriteSheet = {
    image: loadImage(hutSheetPath),
    spriteWidth: 78,
    spriteHeight: 78,
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
let canceledFrameHandle: number | undefined;
export const animationFrame = async (timestamp: number) => {
    const state = await getGameState();
    if (canceledFrameHandle && canceledFrameHandle === frameHandle) {
        return;
    }
    canvas.width = tileSize * levelWidth;
    canvas.height = tileSize * levelHeight;

    context.save();

    context.imageSmoothingEnabled = false;
    context.drawImage(levelBackgrounds[state.season], 0, 0);

    state.enemies.forEach((enemy) => {
        if (enemy.path?.[0]?.type === PathNodeType.Empty) {
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

    // TODO: enemy direction as they move
    for (const enemy of state.enemies) {
        if (enemy.type === 0) {
            break;
        }
        drawEnemy(context, enemy.x, enemy.y, enemy.type, timestamp, Direction.Right);
    }

    // TODO: sort by y to ensure overlap is correct
    state.towers.forEach((tower) => {
        drawTower(context, tower.x, tower.y, tower.type, tower.growthStage, timestamp);
    });

    if (isHovering && towerHoverPosition) {
        context.fillRect(
            towerHoverPosition.x * tileSize - tileSize,
            towerHoverPosition.y * tileSize - tileSize,
            tileSize * 3,
            tileSize * 3
        );
    }

    for (const projectile of state.projectiles) {
        if (projectile.type === 0) {
            break;
        }
        const progress = getProjectileProgress(projectile.type, projectile.startTimestamp, state.gametime);
        const source = state.towers.find((tower) => tower.id === projectile.sourceId);
        if (!source) {
            continue;
        }
        const projectileX = lerp(source.x, projectile.targetPoint.x, progress);
        const projectileY = lerp(source.y, projectile.targetPoint.y, progress);
        context.fillStyle = "gold";
        context.beginPath();
        context.arc(projectileX, projectileY, 3, 0, Math.PI * 2);
        context.fill();
    }

    drawSprite(context, hutSheet, defendPoint.x, defendPoint.y - hutSheet.spriteWidth / 2 + 6, [
        getHutVersion(state.season),
        0,
    ]);

    context.fillStyle = "black";
    context.fillText("Health: " + state.playerHealth, canvas.width - 60, 10);

    context.restore();

    frameHandle = requestAnimationFrame(animationFrame);
};

export const startLoop = () => {
    frameHandle = requestAnimationFrame(animationFrame);
};
