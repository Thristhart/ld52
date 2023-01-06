import BufferBackedObject from "buffer-backed-object";
import { GameStateDescription } from "~/models/gameStateDescription";
import { nextSeason } from "./models/season";

export const gameStateBuffer = new ArrayBuffer(1024);
const gameState = new BufferBackedObject(gameStateBuffer, GameStateDescription);

export const onClick = () => {
    gameState.season = nextSeason(gameState.season);
};
