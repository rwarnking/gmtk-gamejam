import GameObject from "./gameobject";

const CELL = Object.freeze({
    EMPTY: -1,
    DEFAULT: 0,
    OBSTACLE: 1,
    COLLECTIBLE: 2,
    GOAL: 3,
    START: 4
});
const TILE_MODS = Object.freeze({
    PLAYER: 0,
    ENEMY: 1,
});

class Tile extends GameObject {

    constructor(position, celltype=CELL.EMPTY) {
        super({});
        // position in the grid as array
        this.position = position;
        this.cell = celltype;
    }

    setCellType(type) {
        this.cell = Object.values(CELL).includes(type) ? type : CELL.EMPTY;
    }

    isCellType(type) {
        return this.cell === type;
    }

    isEmpty() {
        return this.isCellType(CELL.EMPTY);
    }

    setTilePosition(position) {
        this.position = position;
    }

    getTilePosition() {
        return this.position;
    }

    canMoveTo() {
        return !this.isCellType(CELL.OBSTACLE) & !this.isCellType(CELL.ENEMY);
    }

}

export { Tile as default, CELL, TILE_MODS }