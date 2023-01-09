export enum TowerType {
    None = 0,
    Corn = 1,
    Grape = 2,
    Coconut = 3,
}

export const towerCosts = {
    [TowerType.None]: 5,
    [TowerType.Corn]: 5,
    [TowerType.Grape]: 30,
    [TowerType.Coconut]: 60,
};

export const towerRadiuses = {
    [TowerType.None]: 0,
    [TowerType.Corn]: 100,
    [TowerType.Grape]: 48,
    [TowerType.Coconut]: 64,
};

export const grapeAOEDuration = 500;

export const moneyPerKill = 1;
