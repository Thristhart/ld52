import { gameWorker, lastGameState } from "~/gameWorkerWrapper";
import { canvas } from "~/render/renderLoop";
import { isTileAllowedTower, tileSize } from "./models/level";
import { TowerType } from "./models/towers";

function onClick() {
    if (selectedTowerInfo.hoveredTower !== undefined) {
        selectedTowerInfo.inspectingTower = selectedTowerInfo.hoveredTower;
        selectedTowerInfo.selectedTower = TowerType.None;
    } else if (towerHoverPosition) {
        gameWorker.placeTower(selectedTowerInfo.selectedTower, towerHoverPosition.x, towerHoverPosition.y);
    } else {
        selectedTowerInfo.selectedTower = TowerType.None;
        selectedTowerInfo.inspectingTower = undefined;
    }
}

export const mousePosition = { x: 0, y: 0 };
export const mouseGridPosition = { x: 0, y: 0 };
export let isHovering = false;
export let towerHoverPosition: { x: number; y: number } | undefined;

export const selectedTowerInfo: {
    selectedTower: TowerType;
    hoveredTower: number | undefined;
    inspectingTower: number | undefined;
} = {
    selectedTower: TowerType.None,
    hoveredTower: undefined,
    inspectingTower: undefined,
};

function onKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape") {
        selectedTowerInfo.selectedTower = TowerType.None;
    }
}

function onMouseMove(e: MouseEvent) {
    const boundingClientRect = canvas.getBoundingClientRect();
    const x = (e.offsetX / boundingClientRect.width) * canvas.width;
    const y = (e.offsetY / boundingClientRect.height) * canvas.height;
    mousePosition.x = x;
    mousePosition.y = y;
    mouseGridPosition.x = Math.floor(x / tileSize);
    mouseGridPosition.y = Math.floor(y / tileSize);

    selectedTowerInfo.hoveredTower = overlapsWithTower(mouseGridPosition.x, mouseGridPosition.y);

    findValidLocationForTower();
    isHovering = true;
}

function overlapsWithTower(gridX: number, gridY: number) {
    if (!lastGameState) {
        return undefined;
    }
    for (const tower of lastGameState.towers) {
        const tX = Math.floor(tower.x / tileSize);
        const tY = Math.floor(tower.y / tileSize);
        if (gridX - 1 <= tX + 1 && gridY - 1 <= tY + 1 && tX - 1 <= gridX + 1 && tY - 1 <= gridY + 1) {
            return tower.id;
        }
    }
    return undefined;
}

function isLocationValidForTower(x: number, y: number) {
    if (!lastGameState) {
        return false;
    }
    for (const [gridX, gridY] of [
        [x - 1, y - 1],
        [x, y - 1],
        [x + 1, y - 1],
        [x - 1, y],
        [x, y],
        [x + 1, y],
        [x - 1, y + 1],
        [x, y + 1],
        [x + 1, y + 1],
    ]) {
        if (!isTileAllowedTower(gridX, gridY)) {
            return false;
        }
        if (overlapsWithTower(gridX, gridY) !== undefined) {
            return false;
        }
    }
    return true;
}

function findValidLocationForTower() {
    if (!selectedTowerInfo.selectedTower) {
        return;
    }
    towerHoverPosition = undefined;
    const { x, y } = mouseGridPosition;
    for (const [gridX, gridY] of [
        [x, y],
        [x - 1, y - 1],
        [x, y - 1],
        [x + 1, y - 1],
        [x - 1, y],
        [x + 1, y],
        [x - 1, y + 1],
        [x, y + 1],
        [x + 1, y + 1],
    ]) {
        if (isLocationValidForTower(gridX, gridY)) {
            towerHoverPosition = { x: gridX, y: gridY };
            return;
        }
    }
}

function onMouseLeave() {
    isHovering = false;
}

export function setupListeners() {
    canvas.addEventListener("click", onClick);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);
    document.body.addEventListener("keydown", onKeyDown);
}

if (import.meta.hot) {
    import.meta.hot.dispose(() => {
        canvas.removeEventListener("click", onClick);
        canvas.removeEventListener("mousemove", onMouseMove);
        canvas.removeEventListener("mouseleave", onMouseLeave);
        document.body.removeEventListener("keydown", onKeyDown);
    });
}
