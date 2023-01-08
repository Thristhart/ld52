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
}

export interface Tower {
    type: number;
    id: number;
    x: number;
    y: number;
    growthStage: number;
    lastGrowthTime: number;
    lastShootTime: number;
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
    enemies: Enemy[];
    towers: Tower[];
    projectiles: Projectile[];
    aoes: AOE[];
}
