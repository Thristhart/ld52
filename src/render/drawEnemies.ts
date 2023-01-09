import slimeSheetPath from "~/assets/images/slimes.png";
import { Direction } from "~/models/direction";
import { enemyHealthMaxes, EnemyType } from "~/models/enemies";
import { drawSprite, SpriteSheet } from "./drawSprite";
import { loadImage } from "./loadImage";

const slimeSheet: SpriteSheet = {
    image: loadImage(slimeSheetPath),
    spriteWidth: 16,
    spriteHeight: 16,
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
    health: number,
    direction: Direction,
    timestamp: number
) {
    switch (enemyType) {
        case EnemyType.Slime:
            let width = slimeSheet.spriteWidth,
                height = slimeSheet.spriteHeight;
            context.save();
            context.fillStyle = "red";
            context.fillRect(
                x - width / 2,
                y - height / 2 + 1,
                (health / enemyHealthMaxes[EnemyType.Slime]) * slimeSheet.spriteWidth,
                1
            );
            context.restore();
            return drawSprite(context, slimeSheet, x, y, getSlimeWalkFrame(direction, timestamp));
    }
}
