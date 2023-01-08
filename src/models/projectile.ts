export enum ProjectileType {
    None = 0,
    Corn = 1,
}

export const cornProjectileDuration = 300;

export function getProjectileProgress(type: ProjectileType, startTimestamp: number, currentTimestamp: number) {
    switch (type) {
        case ProjectileType.None:
            return 0;
        case ProjectileType.Corn:
            return Math.min((currentTimestamp - startTimestamp) / cornProjectileDuration, 1);
    }
}
