import { GameState } from "~/models/gameStateDescription";

export const gameState: GameState = {
    gametime: 0,
    season: 0,
    hasWon: false,
    playerHealth: 100,
    currency: 50,
    enemies: [],
    towers: [],
    projectiles: [],
    aoes: [],
};
