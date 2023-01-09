import { Direction } from "./direction";
import { TowerType } from "./towers";

export interface PathNode {
    type: number;
    x: number;
    y: number;
}

export enum PathNodeType {
    Empty = 0,
    Upcoming = 1,
    Visited = 2,
}

export interface Enemy {
    type: number;
    id: number;
    x: number;
    y: number;
    health: number;
    path: PathNode[];
    direction: Direction;
}

export interface Tower {
    type: TowerType;
    id: number;
    x: number;
    y: number;
    growthStage: number;
    lastGrowthTime: number;
    lastShootTime: number;
    kills: number;
}

export interface Projectile {
    type: number;
    sourceId: number;
    targetId: number;
    targetPoint: {
        x: number;
        y: number;
    };
    startTimestamp: number;
}

export enum AOEType {
    Grape = 1,
}
export interface AOE {
    type: AOEType;
    x: number;
    y: number;
    radius: number;
    startTimestamp: number;
}

export interface GameState {
    gametime: number;
    season: number;
    playerHealth: number;
    currency: number;
    enemies: Enemy[];
    towers: Tower[];
    projectiles: Projectile[];
    aoes: AOE[];
}
