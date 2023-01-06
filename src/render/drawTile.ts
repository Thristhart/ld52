import seasonTilesPath from "~/assets/images/seasonal_tiles.png";
import { Season } from "~/models/season";
import { drawSprite, SpriteSheet } from "./drawSprite";
import { loadImage } from "./loadImage";

const seasonTilesSheet: SpriteSheet = {
    image: loadImage(seasonTilesPath),
    spriteSize: 16,
};

export const PathTile = [[12, 8]] as const;
export const PathTop = [[9, 8]] as const;
export const PathBottom = [[8, 7]] as const;
export const PathLeft = [[7, 8]] as const;
export const PathRight = [[10, 7]] as const;
export const PathTopLeft = [[11, 8]] as const;
export const BasicTile = [[12, 2]] as const;

export const tileSize = 16;
/** the width of a season in the tilesheet  */
const seasonSize = 13;

export function drawTiles(
    context: CanvasRenderingContext2D,
    tiles: ReadonlyArray<readonly [x: number, y: number]>,
    x: number,
    y: number,
    season: Season
) {
    for (const tile of tiles) {
        drawSprite(context, seasonTilesSheet, x * tileSize, y * tileSize, [season * seasonSize + tile[0], tile[1]]);
    }
}
