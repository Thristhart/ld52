export enum EnemyType {
    None = 0,
    Slime = 1,
    Golem = 2,
    BlueSlime = 3,
}

export const enemyHealthMaxes = {
    [EnemyType.None]: 10,
    [EnemyType.Slime]: 10,
    [EnemyType.Golem]: 200,
    [EnemyType.BlueSlime]: 12,
};

export const enemySpeeds = {
    [EnemyType.None]: 1,
    [EnemyType.Slime]: 1,
    [EnemyType.Golem]: 0.5,
    [EnemyType.BlueSlime]: 1.2,
};

export const enemyDamage = {
    [EnemyType.None]: 1,
    [EnemyType.Slime]: 1,
    [EnemyType.Golem]: 3,
    [EnemyType.BlueSlime]: 1,
};
