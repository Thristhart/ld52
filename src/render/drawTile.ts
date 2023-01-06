import seasonTilesPath from "~/assets/images/seasonal_tiles.png";
import { Season } from "~/models/season";

const seasonTiles = new Image();
seasonTiles.src = seasonTilesPath;

export const EdgeTile = [0, 0] as const;
export const BasicTile = [12, 2] as const;

const tileSize = 16;
/** the width of a season in the tilesheet  */
const seasonSize = 13;

export function drawTile(
    context: CanvasRenderingContext2D,
    tile: readonly [x: number, y: number],
    x: number,
    y: number,
    season: Season
) {
    context.drawImage(
        seasonTiles,
        (season * seasonSize + tile[0]) * tileSize,
        tile[1] * tileSize,
        tileSize,
        tileSize,
        x,
        y,
        tileSize,
        tileSize
    );
}
