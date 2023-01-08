import { GameState } from "~/models/gameStateDescription";
import { towerCosts, TowerType } from "~/models/towers";

const healthbar = document.getElementById("healthbar") as HTMLProgressElement;

export function drawUI(state: GameState) {
    healthbar.value = state.playerHealth;
    document.body.dataset.season = state.season.toString();
    drawSidebar();
}

const availableTowers = [TowerType.Corn];

const towerlist = document.getElementById("towerlist") as HTMLUListElement;
function drawSidebar() {
    availableTowers.forEach((type) => {
        const towerName = TowerType[type];
        let towerEntry = towerlist.querySelector(`[data-tower=${towerName}]`);
        if (!towerEntry) {
            towerEntry = document.createElement("li");
            towerlist.appendChild(towerEntry);
        }
        towerEntry.setAttribute("data-tower", towerName);
        towerEntry.setAttribute("data-cost", towerCosts[type].toString());
    });
}
