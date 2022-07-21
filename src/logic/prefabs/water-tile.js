import GAME from "../../core/globals";
import Component from "../component";

export default class WaterTile extends Component {

    constructor(obj) {
        super(obj, null, null, "WaterTile");
    }

    static create(obj) {
        return new WaterTile(obj);
    }

    onEnter() {
        // play sound
        GAME.audio().playEffect("SPLASH")
        // remove number from dice
        GAME.logic().dice.removeNumber();
    }

}