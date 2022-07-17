import * as THREE from "three";
import GAME from "../../core/globals";
import Component from "../component";
import { CELL } from "./tile";

export default class GoalTile extends Component {

    constructor(obj, func=null) {
        super(obj, func, "GoalTile");
        obj.setCellType(CELL.GOAL);
        this.updateTexture();
    }

    static create(obj, n) {
        return new GoalTile(obj);
    }

    updateTexture() {
        const tex = new THREE.TextureLoader().load(
            'assets/sprites/rainbow-goal_128x64_t.png'
        );
        this.obj.getObject3D().material.map = tex;
    }

    onEnter() {
        GAME.logic().setGoalReached(true);
    }

    onLeave() {
        GAME.logic().setGoalReached(false);
    }
}