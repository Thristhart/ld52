import ldtkData from "~/assets/ldtk/testLevel.json";
import levelBackgroundPath from "~/assets/ldtk/testLevel/png/Level_0__MapData.png";
import { loadImage } from "~/render/loadImage";

const level = ldtkData.levels[0];
const layer = level.layerInstances[0];
const levelData = layer.intGridCsv;

function getTileAtPosition(x: number, y: number) {
    return levelData[x * layer.__cWid + y * layer.__cHei];
}

export const levelBackground = loadImage(levelBackgroundPath);

export const levelWidth = layer.__cWid;
export const levelHeight = layer.__cHei;

export function isTilePathable(x: number, y: number) {
    return getTileAtPosition(x, y) === 1;
}
