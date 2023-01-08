import { Circle, Quadtree, Rectangle } from "@timohausmann/quadtree-ts";
import { levelHeight, levelWidth, tileSize } from "~/models/level";

export const towerQuadtree = new Quadtree<Rectangle<number>>({
    width: levelWidth * tileSize,
    height: levelHeight * tileSize,
});

export const enemyQuadtree = new Quadtree<Circle<number>>({
    width: levelWidth * tileSize,
    height: levelHeight * tileSize,
});
