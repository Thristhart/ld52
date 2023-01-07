import ldtkData from "~/assets/ldtk/testLevel.json";
import levelAutumnBgPath from "~/assets/ldtk/testLevel/png/Level_0__AutoLayerAutumn.png";
import levelSpringBgPath from "~/assets/ldtk/testLevel/png/Level_0__AutoLayerSpring.png";
import levelSummerBgPath from "~/assets/ldtk/testLevel/png/Level_0__AutoLayerSummer.png";
import levelWinterBgPath from "~/assets/ldtk/testLevel/png/Level_0__AutoLayerWinter.png";
import { loadImage } from "~/render/loadImage";

const level = ldtkData.levels[0];
const layer = level.layerInstances[0];
const levelData = layer.intGridCsv;

function getTileAtPosition(x: number, y: number) {
    return levelData[x * layer.__cWid + y * layer.__cHei];
}

export const levelBackgrounds = [
    loadImage(levelSpringBgPath),
    loadImage(levelSummerBgPath),
    loadImage(levelAutumnBgPath),
    loadImage(levelWinterBgPath),
];

export const levelWidth = layer.__cWid;
export const levelHeight = layer.__cHei;

export function isTilePathable(x: number, y: number) {
    return getTileAtPosition(x, y) === 1;
}
