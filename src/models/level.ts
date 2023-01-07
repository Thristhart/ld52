import ldtkData from "~/assets/ldtk/testLevel.json";

const level = ldtkData.levels[0];

function getLayerWithID(id: string) {
    const layer = level.layerInstances.find((layer) => layer.__identifier === id);
    if (!layer) {
        throw `Can't find ${id} layer`;
    }
    return layer;
}
const mapData = getLayerWithID("MapData");
const entityData = getLayerWithID("Entities");

const levelData = mapData.intGridCsv;

const spawnPointEnt = entityData.entityInstances.find((ent) => ent.__identifier === "Spawn");
const defendPointEnt = entityData.entityInstances.find((ent) => ent.__identifier === "DefendPoint");

if (!spawnPointEnt || !defendPointEnt) {
    throw "Couldn't find Spawn and DefendPoint";
}

export const spawnPoint = { x: spawnPointEnt.px[0], y: spawnPointEnt.px[1] };
export const defendPoint = { x: defendPointEnt.px[0], y: defendPointEnt.px[1] };

export const levelWidth = mapData.__cWid;
export const levelHeight = mapData.__cHei;

export const getTileAtPosition = (x: number, y: number) => {
    return levelData[x * levelWidth + y];
};

export function isTilePathable(x: number, y: number) {
    return getTileAtPosition(x, y) === 2;
}

export const tileSize = 16;
