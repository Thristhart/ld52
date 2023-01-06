import BufferBackedObject from "buffer-backed-object";

export const GameStateDescription = {
    gametime: BufferBackedObject.Uint32(),
    season: BufferBackedObject.Uint8(),
};
