import Heap from "heap-js";
import { isTilePathable, levelHeight, levelWidth, tileSize } from "~/models/level";

export interface Point {
    x: number;
    y: number;
}

function getNodeAtPoint(point: Point): Node {
    const x = Math.floor(point.x / tileSize);
    const y = Math.floor(point.y / tileSize);

    return {
        point: { x: x * tileSize, y: y * tileSize },
        x,
        y,
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
}

function makeNodeAt(x: number, y: number, parent: Node): Node {
    return {
        x,
        y,
        parent,
        point: {
            x: x * tileSize,
            y: y * tileSize,
        },
    };
}

function getNeighbors(node: Node) {
    const neighbors: Node[] = [];

    if (node.y > 0) {
        if (node.x > 0) {
            neighbors.push(makeNodeAt(node.x - 1, node.y - 1, node));
        }
        neighbors.push(makeNodeAt(node.x, node.y - 1, node));
        if (node.x < levelWidth) {
            neighbors.push(makeNodeAt(node.x + 1, node.y - 1, node));
        }
    }
    if (node.x > 0) {
        neighbors.push(makeNodeAt(node.x - 1, node.y, node));
    }
    if (node.x < levelWidth) {
        neighbors.push(makeNodeAt(node.x + 1, node.y, node));
    }
    if (node.y < levelHeight) {
        if (node.x > 0) {
            neighbors.push(makeNodeAt(node.x - 1, node.y + 1, node));
        }
        neighbors.push(makeNodeAt(node.x, node.y + 1, node));
        if (node.x < levelWidth) {
            neighbors.push(makeNodeAt(node.x + 1, node.y + 1, node));
        }
    }

    return neighbors;
}

function getCheapestKnownScoreForNode(node: Node) {
    return node.cheapestKnownPathScore ?? Infinity;
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

    startNode.cheapestKnownPathScore = 0;

    open.push(startNode);

    for (const currentNode of open) {
        if (currentNode.x === endNode.x && currentNode.y === endNode.y) {
            return backtrack(currentNode);
        }

        const neighbors = getNeighbors(currentNode);
        for (const neighbor of neighbors) {
            // Diagonals should cost more
            const weight = neighbor.x !== currentNode.x || neighbor.y! == currentNode.y ? 1 : 1.41421;

            const scoreForNeighbor = getCheapestKnownScoreForNode(currentNode) + weight;
            if (scoreForNeighbor < getCheapestKnownScoreForNode(neighbor)) {
                neighbor.cheapestKnownPathScore = scoreForNeighbor;
                neighbor.parent = currentNode;
                if (!open.contains(neighbor, (a, b) => a.x === b.x && a.y === b.y)) {
                    open.push(neighbor);
                }
            }
        }
    }

    return [];
}
