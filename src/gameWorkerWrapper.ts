import BufferBackedObject from "buffer-backed-object/buffer-backed-object";
import { GameState, GameStateDescription } from "~/models/gameStateDescription";

export const gameWorker = new ComlinkWorker<typeof import("./gameWorker")>(new URL("./gameWorker", import.meta.url));
export async function getGameState() {
    return (lastGameState = new BufferBackedObject(await gameWorker.gameStateBuffer, GameStateDescription));
}
export let lastGameState: GameState;
