import { BasicTile, PathBottom, PathLeft, PathRight, PathTile, PathTop, PathTopLeft } from "~/render/drawTile";

export const levelData = `
00000000[1]000000000
000_____.1]000000000
00[11111111111111]00
0001----[1]000000000
00010000[1]000000000
00010000[1]000000000
00010000[1]000000000
00010000[1]000000000
00010000[1]000000000
00010000[1]000000000
00010000[1]000000000
00010000[1]000000000
00010000[1]000000000
00010000[1]000000000
00010000[1]000000000
00010000[1]000000000
0001111111]000000000
00000000[1]000000000
00000000[1]000000000
00000000[1]000000000
`
    .trim()
    .split("\n")
    .map((line) =>
        line.split("").map((digit) => {
            switch (digit) {
                case "0":
                    return BasicTile;
                case "1":
                    return PathTile;
                case "[":
                    return PathLeft;
                case "]":
                    return PathRight;
                case ".":
                    return PathTopLeft;
                case "_":
                    return PathTop;
                case "-":
                    return PathBottom;
                default:
                    return BasicTile;
            }
        })
    );

export const levelHeight = levelData.length;
export const levelWidth = levelData[0].length;

export function isTilePathable(x: number, y: number) {
    return levelData[y][x] === PathTile;
}
