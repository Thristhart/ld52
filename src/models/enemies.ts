export enum EnemyType {
    None = 0,
    Slime = 1,
    Golem = 2,
    BlueSlime = 3,
    KnightMounted = 4,
    Knight = 5,
}

export const enemyHealthMaxes = {
    [EnemyType.None]: 10,
    [EnemyType.Slime]: 10,
    [EnemyType.Golem]: 200,
    [EnemyType.BlueSlime]: 12,
    [EnemyType.KnightMounted]: 32,
    [EnemyType.Knight]: 600,
};

export const enemySpeeds = {
    [EnemyType.None]: 1,
    [EnemyType.Slime]: 1,
    [EnemyType.Golem]: 0.5,
    [EnemyType.BlueSlime]: 1.2,
    [EnemyType.KnightMounted]: 2,
    [EnemyType.Knight]: 0.25,
};

export const enemyDamage = {
    [EnemyType.None]: 1,
    [EnemyType.Slime]: 1,
    [EnemyType.Golem]: 3,
    [EnemyType.BlueSlime]: 1,
    [EnemyType.KnightMounted]: 15,
    [EnemyType.Knight]: 5,
};
