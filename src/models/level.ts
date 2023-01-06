import { BasicTile, PathLeft, PathRight, PathTile } from "~/render/drawTile";

export const levelData = `
00000000[1]000000000
00000000[1]000000000
00000000[1]000000000
00000000[1]000000000
00000000[1]000000000
00000000[1]000000000
00000000[1]000000000
00000000[1]000000000
00000000[1]000000000
00000000[1]000000000
00000000[1]000000000
00000000[1]000000000
00000000[1]000000000
00000000[1]000000000
00000000[1]000000000
00000000[1]000000000
00000000[1]000000000
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
                default:
                    return BasicTile;
            }
        })
    );

export const levelHeight = levelData.length;
export const levelWidth = levelData[0].length;
