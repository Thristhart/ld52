export enum TowerType {
    None = 0,
    Corn = 1,
    Grape = 2,
}

export const towerCosts = {
    [TowerType.None]: 5,
    [TowerType.Corn]: 5,
    [TowerType.Grape]: 30,
};

export const towerRadiuses = {
    [TowerType.None]: 0,
    [TowerType.Corn]: 100,
    [TowerType.Grape]: 48,
};

export const grapeAOEDuration = 500;
