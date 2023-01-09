import cornSheetPath from "~/assets/images/corn.png";
import grapeSheetPath from "~/assets/images/grapes.png";
import { tileSize } from "~/models/level";
import { TowerType } from "~/models/towers";
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

export function drawTower(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    towerType: TowerType,
    growthStage: number,
    _timestamp: number
) {
    switch (towerType) {
        case TowerType.Corn:
            return drawSprite(context, cornSheet, x, y - tileSize / 2, getCornGrowthFrame(growthStage));
        case TowerType.Grape:
            return drawSprite(context, grapeSheet, x, y - tileSize / 2, getGrapeGrowthFrame(growthStage));
    }
}
