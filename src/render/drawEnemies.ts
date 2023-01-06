import slimeSheetPath from "~/assets/images/slimes.png";
import { Direction } from "~/models/direction";
import { EnemyType } from "~/models/enemies";
import { drawSprite, SpriteSheet } from "./drawSprite";
import { loadImage } from "./loadImage";

const slimeSheet: SpriteSheet = {
    image: loadImage(slimeSheetPath),
    spriteSize: 16,
};
const slimeWalkFrameDuration = 100;
const slimeWalkFrameCount = 5;
function getSlimeWalkFrame(timestamp: number, direction: Direction) {
    const x = Math.floor((timestamp % (slimeWalkFrameDuration * slimeWalkFrameCount)) / slimeWalkFrameDuration);
    return [x, direction] as const;
}

export function drawEnemy(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    enemyType: EnemyType,
    direction: Direction,
    timestamp: number
) {
    switch (enemyType) {
        case EnemyType.Slime:
            return drawSprite(context, slimeSheet, x, y, getSlimeWalkFrame(direction, timestamp));
    }
}
