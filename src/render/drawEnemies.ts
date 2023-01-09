import golemSheetPath from "~/assets/images/monster_golem1.png";
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
function getSlimeWalkFrame(timestamp: number, direction: Direction, typeModifier = 0) {
    const x = Math.floor((timestamp % (slimeWalkFrameDuration * slimeWalkFrameCount)) / slimeWalkFrameDuration);
    return [x + typeModifier, direction] as const;
}

const golemSheet: SpriteSheet = {
    image: loadImage(golemSheetPath),
    spriteWidth: 47,
    spriteHeight: 50,
};
const golemWalkFrameDuration = 300;
const golemWalkFrameCount = 3;
function getGolemWalkFrame(timestamp: number, direction: Direction) {
    let directionIndex = 0;
    switch (direction) {
        case Direction.Down:
            directionIndex = 0;
            break;
        case Direction.Left:
            directionIndex = 1;
            break;
        case Direction.Right:
            directionIndex = 2;
            break;
        case Direction.Up:
            directionIndex = 3;
            break;
    }
    const x = Math.floor((timestamp % (golemWalkFrameDuration * golemWalkFrameCount)) / golemWalkFrameDuration);
    return [x, directionIndex] as const;
}

const enemySheets = {
    [EnemyType.None]: slimeSheet,
    [EnemyType.Slime]: slimeSheet,
    [EnemyType.Golem]: golemSheet,
    [EnemyType.BlueSlime]: slimeSheet,
};

export function drawEnemy(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    enemyType: EnemyType,
    health: number,
    direction: Direction,
    timestamp: number
) {
    const sheet = enemySheets[enemyType];
    switch (enemyType) {
        case EnemyType.Slime:
            drawSprite(context, sheet, x, y, getSlimeWalkFrame(direction, timestamp));
            break;
        case EnemyType.Golem:
            drawSprite(context, sheet, x, y - sheet.spriteHeight / 3, getGolemWalkFrame(direction, timestamp));
            break;
        case EnemyType.BlueSlime:
            drawSprite(context, sheet, x, y, getSlimeWalkFrame(direction, timestamp, 20));
            break;
    }
    if (health !== enemyHealthMaxes[enemyType]) {
        const width = sheet.spriteWidth;
        const height = sheet.spriteHeight;
        context.save();
        context.fillStyle = "red";
        context.fillRect(
            x - width / 2,
            y - height / 2 + 1,
            (health / enemyHealthMaxes[enemyType]) * sheet.spriteWidth,
            2
        );
        context.restore();
    }
}
