import seasonTilesPath from "~/assets/images/seasonal_tiles.png";
import { Season } from "~/models/season";

const seasonTiles = new Image();
seasonTiles.src = seasonTilesPath;

export const PathTile = [[12, 8]] as const;
export const PathLeft = [[7, 8]] as const;
export const PathRight = [[10, 7]] as const;
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
        context.drawImage(
            seasonTiles,
            (season * seasonSize + tile[0]) * tileSize,
            tile[1] * tileSize,
            tileSize,
            tileSize,
            x * tileSize,
            y * tileSize,
            tileSize,
            tileSize
        );
    }
}
