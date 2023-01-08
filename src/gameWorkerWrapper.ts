import { GameState } from "~/models/gameStateDescription";

export const gameWorker = new ComlinkWorker<typeof import("./gameWorker")>(new URL("./gameWorker", import.meta.url));
export async function getGameState() {
    return (lastGameState = await gameWorker.getGameState());
}
export let lastGameState: GameState | undefined;
