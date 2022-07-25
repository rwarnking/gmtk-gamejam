import GAME from "../../core/globals";
import Component from "../component";
import { CELL } from "../gameobjects/tile";

export default class WaterTile extends Component {

    constructor(obj) {
        super(obj, null, null, "WaterTile");
        obj.setCellType(CELL.WATER);
    }

    static create(obj) {
        return new WaterTile(obj);
    }

    onEnter() {
        // play sound
        GAME.audio().playEffect("SPLASH")
        // remove number from dice
        GAME.logic().removeNumber();
    }

}