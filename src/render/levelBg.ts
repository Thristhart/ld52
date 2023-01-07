import levelAutumnBgPath from "~/assets/ldtk/testLevel/png/Level_0__AutoLayerAutumn.png";
import levelSpringBgPath from "~/assets/ldtk/testLevel/png/Level_0__AutoLayerSpring.png";
import levelSummerBgPath from "~/assets/ldtk/testLevel/png/Level_0__AutoLayerSummer.png";
import levelWinterBgPath from "~/assets/ldtk/testLevel/png/Level_0__AutoLayerWinter.png";
import { loadImage } from "~/render/loadImage";

export const levelBackgrounds = [
    loadImage(levelSpringBgPath),
    loadImage(levelSummerBgPath),
    loadImage(levelAutumnBgPath),
    loadImage(levelWinterBgPath),
];
