import coconutSheetPath from "~/assets/images/coconut_no_shadow.png";
import cornSheetPath from "~/assets/images/corn.png";
import grapeSheetPath from "~/assets/images/grapes.png";
import { tileSize } from "~/models/level";
import { towerCosts, TowerType } from "~/models/towers";
import { drawSprite, SpriteSheet } from "./drawSprite";
import { loadImage } from "./loadImage";

const cornSheet: SpriteSheet = {
    image: loadImage(cornSheetPath),
    spriteWidth: 32,
    spriteHeight: 74,
};
function getCornGrowthFrame(growthStage: number) {
    return [growthStage, 0] as const;
}

const grapeSheet: SpriteSheet = {
    image: loadImage(grapeSheetPath),
    spriteWidth: 32,
    spriteHeight: 64,
};
function getGrapeGrowthFrame(growthStage: number) {
    return [growthStage, 0] as const;
}

const coconutSheet: SpriteSheet = {
    image: loadImage(coconutSheetPath),
    spriteWidth: 55,
    spriteHeight: 97,
};
function getCoconutGrowthFrame(growthStage: number) {
    return [growthStage, 0] as const;
}

export function drawTower(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    towerType: TowerType,
    growthStage: number,
    kills: number
) {
    if (kills > towerCosts[towerType]) {
        context.lineWidth = Math.min((kills / (towerCosts[towerType] * 4)) * 5, 5);

        context.strokeStyle = "gold";
        context.beginPath();
        context.ellipse(x, y + tileSize, tileSize, tileSize / 2, 0, 0, Math.PI * 2);
        context.stroke();
    }
    context.lineWidth = 1;
    switch (towerType) {
        case TowerType.Corn: {
            drawSprite(context, cornSheet, x, y - tileSize / 2, getCornGrowthFrame(growthStage));
            break;
        }
        case TowerType.Grape: {
            drawSprite(context, grapeSheet, x, y - tileSize / 2, getGrapeGrowthFrame(growthStage));
            break;
        }
        case TowerType.Coconut: {
            drawSprite(
                context,
                coconutSheet,
                x,
                y - tileSize / 2 - coconutSheet.spriteHeight / 4,
                getCoconutGrowthFrame(growthStage)
            );
            break;
        }
    }
}
