import BufferBackedObject from "buffer-backed-object";

export const EnemyDescription = {
    type: BufferBackedObject.Uint8(),
    x: BufferBackedObject.Int16(),
    y: BufferBackedObject.Int16(),
};

export const GameStateDescription = {
    gametime: BufferBackedObject.Uint32(),
    season: BufferBackedObject.Uint8(),
    enemies: BufferBackedObject.NestedArrayOfBufferBackedObjects(1024, EnemyDescription),
};
