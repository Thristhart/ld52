export enum Season {
    Spring = 0,
    Summer = 1,
    Fall = 2,
    Winter = 3,
}

export function nextSeason(current: Season) {
    let next = current + 1;
    if (next > Season.Winter) {
        next = Season.Spring;
    }
    return next;
}
