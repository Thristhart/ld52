export enum ProjectileType {
    None = 0,
    Corn = 1,
    Coconut = 2,
}

export const cornProjectileDuration = 300;

export const coconutProjectileDuration = 600;

export function getProjectileProgress(type: ProjectileType, startTimestamp: number, currentTimestamp: number) {
    switch (type) {
        case ProjectileType.None:
            return 0;
        case ProjectileType.Corn:
            return Math.min((currentTimestamp - startTimestamp) / cornProjectileDuration, 1);
        case ProjectileType.Coconut:
            return Math.min((currentTimestamp - startTimestamp) / coconutProjectileDuration, 1);
    }
}
