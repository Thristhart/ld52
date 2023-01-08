import { GameState } from "~/models/gameStateDescription";

const healthbar = document.getElementById("healthbar") as HTMLProgressElement;

export function drawUI(state: GameState) {
    healthbar.value = state.playerHealth;
}
