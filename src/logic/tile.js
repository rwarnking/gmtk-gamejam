import GameObject from "./gameobject";
import GAME from "../core/globals";
import MODS from "./enums/mods";

const CELL = Object.freeze({
    EMPTY: -1,
    DEFAULT: 0,
    OBSTACLE: 1,
    COLLECTIBLE: 2,
    GOAL: 3,
    START: 4
});

class Tile extends GameObject {

    constructor(position, celltype=CELL.EMPTY) {
        super({});
        // position in the grid as array
        this.position = position;
        this.cell = celltype;
        this.mods = [];
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

    addModifier(mod) {
        this.mods.push(mod);
        if (this.cell === CELL.GOAL && mod === MODS.PLAYER) {
            GAME.logic().setGoalReached(true);
        }
    }

    removeModifier(mod) {
        this.mods = this.mods.filter(m => m !== mod);
        if (this.cell === CELL.GOAL && mod === MODS.PLAYER) {
            GAME.logic().setGoalReached(false);
        }
    }

}

export { Tile as default, CELL }