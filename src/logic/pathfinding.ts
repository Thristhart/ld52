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
        point: { x: x * tileSize + tileSize / 2, y: y * tileSize + tileSize / 2 },
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

function makeNodeAt(nodemap: Map<string, Node>, x: number, y: number): Node {
    const existing = nodemap.get(`${x},${y}`);
    if (existing) {
        return existing;
    }
    return {
        x,
        y,
        point: {
            x: x * tileSize + tileSize / 2,
            y: y * tileSize + tileSize / 2,
        },
    };
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
            const weight = isDiagonal ? 2.41421 : 1;

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
