import magicBarrierPath from "~/assets/images/MagicBarrier_64x64.png";
import { AOE, AOEType } from "~/models/gameStateDescription";
import { grapeAOEDuration } from "~/models/towers";
import { drawSprite, SpriteSheet } from "./drawSprite";
import { loadImage } from "./loadImage";

const grapeFrameCount = 33;

const sheet: SpriteSheet = {
    image: loadImage(magicBarrierPath),
    spriteWidth: 64,
    spriteHeight: 64,
};

function getGrapeAOEFrame(dt: number) {
    const x = Math.floor((dt / grapeAOEDuration) * grapeFrameCount);
    return [x, 0] as const;
}

export function drawAOE(context: CanvasRenderingContext2D, aoe: AOE, timestamp: number) {
    if (aoe.type === AOEType.Grape) {
        drawSprite(context, sheet, aoe.x, aoe.y, getGrapeAOEFrame(timestamp - aoe.startTimestamp), {
            width: aoe.radius * 2 * 1.5, // 1.5 fudge factor for grape AOE
            height: aoe.radius * 2 * 1.5,
        });
    } else {
        context.strokeStyle = "purple";
        context.beginPath();
        context.arc(aoe.x, aoe.y, aoe.radius, 0, Math.PI * 2);
        context.stroke();
    }
}
