import { selectedTowerInfo } from "~/input";
import { GameState } from "~/models/gameStateDescription";
import { towerCosts, TowerType } from "~/models/towers";

const healthbar = document.getElementById("healthbar") as HTMLProgressElement;

export function drawUI(state: GameState) {
    healthbar.value = state.playerHealth;
    document.body.dataset.season = state.season.toString();
    drawSidebar();
}

const availableTowers = [TowerType.Corn, TowerType.Grape];

const towerlist = document.getElementById("towerlist") as HTMLUListElement;
function drawSidebar() {
    availableTowers.forEach((type) => {
        const towerName = TowerType[type];
        let towerEntry = towerlist.querySelector(`[data-tower=${towerName}]`);
        if (!towerEntry) {
            towerEntry = document.createElement("li");
            const name = document.createElement("span");
            name.className = "name";
            const cost = document.createElement("span");
            cost.className = "cost";
            const image = document.createElement("div");
            image.className = "image";
            towerEntry.appendChild(image);
            towerEntry.appendChild(name);
            towerEntry.appendChild(cost);
            towerEntry.addEventListener("click", () => {
                selectedTowerInfo.selectedTower = type;
            });
            towerlist.appendChild(towerEntry);
        }
        towerEntry.setAttribute("data-tower", towerName);
        towerEntry.setAttribute("data-cost", towerCosts[type].toString());
        towerEntry.setAttribute("data-selected", (selectedTowerInfo.selectedTower === type).toString());
    });
}
