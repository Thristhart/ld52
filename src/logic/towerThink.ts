import { GameState, Tower } from "~/models/gameStateDescription";
import { TowerType } from "~/models/towers";

const growthDuration = 600;

export async function towerThink(gameState: GameState, entId: number, tower: Tower, timestamp: number) {
    switch (tower.type) {
        case TowerType.Corn:
            if (tower.growthStage < 5) {
                if (timestamp - tower.lastGrowthTime > growthDuration) {
                    tower.growthStage++;
                    tower.lastGrowthTime = timestamp;
                }
                return;
            }
            break;
    }
}
