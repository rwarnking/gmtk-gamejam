import * as THREE from "three";
import GAME from "../../core/globals";
import Component from "../component";
import { CELL } from "../gameobjects/tile";

export default class GoalTile extends Component {

    constructor(obj) {
        super(obj, null, null, "GoalTile");
        obj.setCellType(CELL.GOAL);
    }

    static create(obj) {
        return new GoalTile(obj);
    }

    onEnter() {
        GAME.logic().setGoalReached(true);
    }

    onLeave() {
        GAME.logic().setGoalReached(false);
    }
}