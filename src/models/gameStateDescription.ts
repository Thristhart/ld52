import BufferBackedObject, { DecodedBuffer } from "buffer-backed-object/buffer-backed-object";

export const PathNodeDescription = {
    type: BufferBackedObject.Uint8(),
    x: BufferBackedObject.Uint32(),
    y: BufferBackedObject.Uint32(),
};

export enum PathNodeType {
    Empty = 0,
    Upcoming = 1,
    Visited = 2,
}

export const EnemyDescription = {
    type: BufferBackedObject.Uint8(),
    x: BufferBackedObject.Float32(),
    y: BufferBackedObject.Float32(),
    path: BufferBackedObject.NestedArrayOfBufferBackedObjects(625, PathNodeDescription),
};

export const TowerDescription = {
    type: BufferBackedObject.Uint8(),
    x: BufferBackedObject.Uint16(),
    y: BufferBackedObject.Uint16(),
    growthStage: BufferBackedObject.Uint8(),
    lastGrowthTime: BufferBackedObject.Uint32(),
};

export const GameStateDescription = {
    gametime: BufferBackedObject.Uint32(),
    season: BufferBackedObject.Uint8(),
    playerHealth: BufferBackedObject.Uint32(),
    enemies: BufferBackedObject.NestedArrayOfBufferBackedObjects(1024, EnemyDescription),
    towers: BufferBackedObject.NestedArrayOfBufferBackedObjects(128, TowerDescription),
};

export type GameState = DecodedBuffer<typeof GameStateDescription>;
export type EnemyState = DecodedBuffer<typeof EnemyDescription>;
export type TowerState = DecodedBuffer<typeof TowerDescription>;
