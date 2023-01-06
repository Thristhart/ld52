export interface SpriteSheet {
    readonly image: HTMLImageElement;
    readonly spriteSize: number;
}

export function drawSprite(
    context: CanvasRenderingContext2D,
    sheet: SpriteSheet,
    x: number,
    y: number,
    frame: readonly [x: number, y: number]
) {
    context.drawImage(
        sheet.image,
        frame[0] * sheet.spriteSize,
        frame[1] * sheet.spriteSize,
        sheet.spriteSize,
        sheet.spriteSize,
        x,
        y,
        sheet.spriteSize,
        sheet.spriteSize
    );
}
