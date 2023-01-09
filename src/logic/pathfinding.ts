import { Rectangle } from "@timohausmann/quadtree-ts";
import Heap from "heap-js";
import { isTilePathable, levelHeight, levelWidth, tileSize } from "~/models/level";
import { TowerType } from "~/models/towers";
import { gameState } from "./gameState";
import { towerQuadtree } from "./quadtree";

export interface Point {
    x: number;
    y: number;
}

function getNodeAtPoint(point: Point): Node {
    const x = Math.floor(point.x / tileSize);
    const y = Math.floor(point.y / tileSize);

    return {
        point: { x: x * tileSize + tileSize / 2, y: y * tileSize + tileSize / 2 },
        x,
        y,
        isOpen: false,
    };
}

function calculateNodeHeuristic(a: Node, endPosition: Node) {
    const dx = Math.abs(endPosition.x - a.x);
    const dy = Math.abs(endPosition.y - a.y);
    a.heuristic = dx + dy;
    return a.heuristic;
}

function compareNodeHeuristics(to: Node, a: Node, b: Node) {
    const aHeuristic = a.heuristic ?? calculateNodeHeuristic(a, to);
    const bHeuristic = b.heuristic ?? calculateNodeHeuristic(b, to);

    return aHeuristic + getCheapestKnownScoreForNode(a) - (bHeuristic + getCheapestKnownScoreForNode(b));
}

function backtrack(node: Node) {
    const path = [node.point];

    let cursor = node;
    while (cursor.parent) {
        cursor = cursor.parent;
        path.push(cursor.point);
    }

    return path.reverse();
}

interface Node {
    x: number;
    y: number;
    point: Point;
    heuristic?: number;
    parent?: Node;
    cheapestKnownPathScore?: number;
    isOpen: boolean;
}

function makeNodeAt(nodemap: Map<string, Node>, x: number, y: number): Node {
    const existing = nodemap.get(`${x},${y}`);
    if (existing) {
        return existing;
    }
    const node = {
        x,
        y,
        point: {
            x: x * tileSize + tileSize / 2,
            y: y * tileSize + tileSize / 2,
        },
        isOpen: false,
    };
    nodemap.set(`${x},${y}`, node);
    return node;
}

function getNeighbors(nodeMap: Map<string, Node>, node: Node) {
    const neighbors: Node[] = [];

    if (node.y > 0) {
        if (node.x > 0) {
            neighbors.push(makeNodeAt(nodeMap, node.x - 1, node.y - 1));
        }
        neighbors.push(makeNodeAt(nodeMap, node.x, node.y - 1));
        if (node.x < levelWidth) {
            neighbors.push(makeNodeAt(nodeMap, node.x + 1, node.y - 1));
        }
    }
    if (node.x > 0) {
        neighbors.push(makeNodeAt(nodeMap, node.x - 1, node.y));
    }
    if (node.x < levelWidth) {
        neighbors.push(makeNodeAt(nodeMap, node.x + 1, node.y));
    }
    if (node.y < levelHeight) {
        if (node.x > 0) {
            neighbors.push(makeNodeAt(nodeMap, node.x - 1, node.y + 1));
        }
        neighbors.push(makeNodeAt(nodeMap, node.x, node.y + 1));
        if (node.x < levelWidth) {
            neighbors.push(makeNodeAt(nodeMap, node.x + 1, node.y + 1));
        }
    }

    return neighbors;
}

function getCheapestKnownScoreForNode(node: Node) {
    return node.cheapestKnownPathScore ?? Infinity;
}

function AABBCollision(rectA: Rectangle<unknown>, rectB: Rectangle<unknown>) {
    return (
        rectA.x <= rectB.x + rectB.width &&
        rectA.y <= rectB.y + rectB.height &&
        rectB.x <= rectA.x + rectA.width &&
        rectB.y <= rectA.y + rectA.height
    );
}

function getTowerWeight(type: TowerType) {
    switch (type) {
        case TowerType.Grape:
            return 2;
        default:
            return 1;
    }
}

export function pathToPoint(from: Point, to: Point) {
    const startNode = getNodeAtPoint(from);
    const endNode = getNodeAtPoint(to);

    const open = new Heap(compareNodeHeuristics.bind(undefined, endNode));

    if (!isTilePathable(startNode.x, startNode.y)) {
        return [];
    }
    if (!isTilePathable(endNode.x, endNode.y)) {
        return [];
    }

    const nodeMap = new Map<string, Node>();
    nodeMap.set(`${startNode.x},${startNode.y}`, startNode);
    nodeMap.set(`${endNode.x},${endNode.y}`, endNode);

    startNode.cheapestKnownPathScore = 0;

    open.push(startNode);

    for (const currentNode of open) {
        currentNode.isOpen = false;
        if (currentNode.x === endNode.x && currentNode.y === endNode.y) {
            return backtrack(currentNode);
        }

        const neighbors = getNeighbors(nodeMap, currentNode);
        for (const neighbor of neighbors) {
            if (!isTilePathable(neighbor.x, neighbor.y)) {
                continue;
            }
            // Diagonals should cost more
            const isDiagonal = currentNode.x !== neighbor.x && currentNode.y !== neighbor.y;
            let weight = isDiagonal ? 2.41421 : 1;

            const bounds = new Rectangle<number>({
                x: neighbor.point.x - tileSize * 2,
                y: neighbor.point.y - tileSize * 2,
                width: tileSize * 4,
                height: tileSize * 4,
            });
            const nearby = towerQuadtree.retrieve(bounds);
            let weightFromTowers = 0;
            for (const nearbyNode of nearby) {
                const tower = gameState.towers.find((t) => t.id === nearbyNode.data);
                if (tower && AABBCollision(nearbyNode, bounds)) {
                    weightFromTowers += getTowerWeight(tower.type);
                }
            }
            weight += weightFromTowers;

            const scoreForNeighbor = getCheapestKnownScoreForNode(currentNode) + weight;
            if (scoreForNeighbor < getCheapestKnownScoreForNode(neighbor)) {
                neighbor.cheapestKnownPathScore = scoreForNeighbor;
                neighbor.parent = currentNode;
                if (!neighbor.isOpen) {
                    open.push(neighbor);
                    neighbor.isOpen = true;
                }
            }
        }
    }

    return [];
}
