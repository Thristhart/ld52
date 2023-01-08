import { Circle, Quadtree, Rectangle } from "@timohausmann/quadtree-ts";
import { levelHeight, levelWidth, tileSize } from "~/models/level";

export const entityQuadtree = new Quadtree<
    Rectangle<{ id: number; type: string }> | Circle<{ id: number; type: string }>
>({
    width: levelWidth * tileSize,
    height: levelHeight * tileSize,
});
export type EntityQuadtree = typeof entityQuadtree;
