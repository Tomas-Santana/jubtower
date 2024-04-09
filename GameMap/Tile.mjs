import MapTiles from "./TextTiles.mjs";

export default class Tile {
    constructor(tileType, blocked, blockSight) {
        this.blocked = blocked;
        this.type = tileType;

        // By default, if a tile is blocked, it also blocks sight
        this.blockSight = blockSight || blocked;
    }
}

