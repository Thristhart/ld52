import levelAutumnBgPath from "~/assets/ldtk/testLevel/png/Level_1__AutoLayerAutumn.png";
import levelSpringBgPath from "~/assets/ldtk/testLevel/png/Level_1__AutoLayerSpring.png";
import levelSummerBgPath from "~/assets/ldtk/testLevel/png/Level_1__AutoLayerSummer.png";
import levelWinterBgPath from "~/assets/ldtk/testLevel/png/Level_1__AutoLayerWinter.png";
import { loadImage } from "~/render/loadImage";

export const levelBackgrounds = [
    loadImage(levelSpringBgPath),
    loadImage(levelSummerBgPath),
    loadImage(levelAutumnBgPath),
    loadImage(levelWinterBgPath),
];
