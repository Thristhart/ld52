import cornSheetPath from "~/assets/images/corn.png";
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

export function drawTower(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    towerType: TowerType,
    growthStage: number,
    timestamp: number
) {
    switch (towerType) {
        case TowerType.Corn:
            return drawSprite(context, cornSheet, x, y, getCornGrowthFrame(growthStage));
    }
}
