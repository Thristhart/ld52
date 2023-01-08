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
    path: PathNode[];
}

export interface Tower {
    type: number;
    id: number;
    x: number;
    y: number;
    growthStage: number;
    lastGrowthTime: number;
}

export interface Projectile {
    type: number;
    sourceId: number;
    targetId: number;
    startTimestamp: number;
}

export interface GameState {
    gametime: number;
    season: number;
    playerHealth: number;
    enemies: Enemy[];
    towers: Tower[];
    projectiles: Projectile[];
}
