import coconutProjectilePath from "~/assets/images/coconut_projectile.png";
import hutSheetPath from "~/assets/images/defendPoint.png";
import gameOverHousePath from "~/assets/images/game_over_house.png";
import victoryPath from "~/assets/images/victory.png";
import { startFailureMusic, startMusicForSeason, startVictoryMusic } from "~/bgMusic";
import { getGameState } from "~/gameWorkerWrapper";
import { isHovering, selectedTowerInfo, towerHoverPosition } from "~/input";
import { lerp } from "~/lerp";
import { PathNodeType } from "~/models/gameStateDescription";
import { defendPoint, levelHeight, levelWidth, tileSize } from "~/models/level";
import { getProjectileProgress, ProjectileType } from "~/models/projectile";
import { Season } from "~/models/season";
import { towerRadiuses } from "~/models/towers";
import { drawAOE } from "./drawAOE";
import { drawEnemy } from "./drawEnemies";
import { drawSprite, SpriteSheet } from "./drawSprite";
import { drawTower } from "./drawTower";
import { drawUI } from "./drawUI";
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

const gameOverHouse = loadImage(gameOverHousePath);
const victory = loadImage(victoryPath);

const coconutProjectileImage = loadImage(coconutProjectilePath);

function getHutVersion(season: Season) {
    switch (season) {
        default:
            return 0;
        case Season.Winter:
            return 1;
    }
}

let previousSeason: Season;

let frameHandle: number;
let canceledFrameHandle: number | undefined;
export const animationFrame = async (timestamp: number) => {
    const state = await getGameState();
    if (canceledFrameHandle && canceledFrameHandle === frameHandle) {
        return;
    }

    canvas.width = tileSize * levelWidth;
    canvas.height = tileSize * levelHeight;
    context.imageSmoothingEnabled = false;

    context.save();

    if (state.playerHealth <= 0) {
        startFailureMusic();
        context.font = "60px sans-serif";
        context.fillText("Game Over :(", 220, 200);
        context.drawImage(gameOverHouse, canvas.width / 2 - 150, canvas.height / 2 - 150, 300, 300);
        context.fillText("Click to try again", 160, 620);
        return;
    }

    if (state.hasWon) {
        startVictoryMusic();
        context.font = "42px sans-serif";
        context.drawImage(victory, 0, 0, canvas.width, canvas.height);
        context.fillText("You made it through the year!", 140, canvas.height - 16);
        drawUI(state);
        return;
    }

    if (previousSeason === undefined) {
        previousSeason = Season.Spring;
    }
    if (previousSeason != state.season) {
        startMusicForSeason(state.season);
    }
    previousSeason = state.season;

    context.drawImage(levelBackgrounds[state.season], 0, 0);

    state.enemies
        .sort((a, b) => a.y - b.y)
        .forEach((enemy) => {
            if (enemy.path?.[0]?.type === PathNodeType.Empty) {
                return;
            }
            context.strokeStyle = "black";
            context.globalAlpha = enemy.path.findIndex((node) => node.type === PathNodeType.Upcoming) / 40;
            context.beginPath();
            context.moveTo(enemy.x, enemy.y);
            for (let i = 0; i < enemy.path.length; i++) {
                const pathNode = enemy.path[i];
                if (pathNode.type === PathNodeType.Empty) {
                    break;
                }
                if (pathNode.type === PathNodeType.Upcoming) {
                    context.lineTo(pathNode.x, pathNode.y);
                }
            }
            context.stroke();
        });
    context.globalAlpha = 1;

    for (const enemy of state.enemies) {
        if (enemy.type === 0) {
            break;
        }
        drawEnemy(context, enemy.x, enemy.y, enemy.type, enemy.health, timestamp, enemy.direction);
    }

    state.towers
        .sort((a, b) => a.y - b.y)
        .forEach((tower) => {
            if (selectedTowerInfo.inspectingTower === tower.id) {
                context.strokeStyle = "black";
                context.strokeRect(tower.x - tileSize * 1.5, tower.y - tileSize * 1.5, tileSize * 3, tileSize * 3);
                context.beginPath();
                context.arc(tower.x, tower.y, towerRadiuses[tower.type], 0, Math.PI * 2);
                context.stroke();
            } else if (selectedTowerInfo.hoveredTower === tower.id) {
                context.strokeStyle = "silver";
                context.strokeRect(tower.x - tileSize * 1.5, tower.y - tileSize * 1.5, tileSize * 3, tileSize * 3);
                context.beginPath();
                context.arc(tower.x, tower.y, towerRadiuses[tower.type], 0, Math.PI * 2);
                context.stroke();
            }
            drawTower(context, tower.x, tower.y, tower.type, tower.growthStage, timestamp);
        });

    if (isHovering && towerHoverPosition && selectedTowerInfo.selectedTower) {
        context.globalAlpha = 0.3;
        context.strokeStyle = "black";
        context.strokeRect(
            towerHoverPosition.x * tileSize - tileSize,
            towerHoverPosition.y * tileSize - tileSize,
            tileSize * 3,
            tileSize * 3
        );
        drawTower(
            context,
            towerHoverPosition.x * tileSize + tileSize / 2,
            towerHoverPosition.y * tileSize + tileSize / 2,
            selectedTowerInfo.selectedTower,
            5,
            timestamp
        );
        context.beginPath();
        context.arc(
            towerHoverPosition.x * tileSize + tileSize / 2,
            towerHoverPosition.y * tileSize + tileSize / 2,
            towerRadiuses[selectedTowerInfo.selectedTower],
            0,
            Math.PI * 2
        );
        context.stroke();
        context.globalAlpha = 1;
    }

    drawSprite(context, hutSheet, defendPoint.x, defendPoint.y - hutSheet.spriteWidth / 2 + 6, [
        getHutVersion(state.season),
        0,
    ]);

    for (const projectile of state.projectiles) {
        if (projectile.type === 0) {
            break;
        }
        const progress = getProjectileProgress(projectile.type, projectile.startTimestamp, state.gametime);
        const source = state.towers.find((tower) => tower.id === projectile.sourceId);
        if (!source) {
            continue;
        }

        if (projectile.type === ProjectileType.Corn) {
            const projectileX = lerp(source.x, projectile.targetPoint.x, progress);
            const projectileY = lerp(source.y, projectile.targetPoint.y, progress);
            context.fillStyle = "gold";
            context.beginPath();
            context.arc(projectileX, projectileY, 3, 0, Math.PI * 2);
            context.fill();
        }
        if (projectile.type === ProjectileType.Coconut) {
            const projectileX = lerp(source.x, projectile.targetPoint.x, progress);
            const projectileY = lerp(source.y - 97 / 2, projectile.targetPoint.y, progress);
            context.drawImage(
                coconutProjectileImage,
                projectileX - coconutProjectileImage.width / 2,
                projectileY - coconutProjectileImage.height / 2
            );
        }
    }

    for (const aoe of state.aoes) {
        drawAOE(context, aoe, state.gametime);
    }

    context.fillStyle = "black";
    context.font = "14pt Helvetica";
    context.fillText("💰" + state.currency, canvas.width - 80, 18);

    context.restore();

    drawUI(state);

    frameHandle = requestAnimationFrame(animationFrame);
};

export const startLoop = () => {
    frameHandle = requestAnimationFrame(animationFrame);
};
