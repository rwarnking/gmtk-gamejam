import * as THREE from "three";
import GAME from "../../core/globals";
import Component from "../component";
import TAGS from "../enums/tags";

export default class NumberTile extends Component {

    constructor(obj, n, func=null) {
        super(obj, func, "NumberTile");
        this.n = n;
        this.prevTexture = obj.getObject3D().material.map;
        obj.addTag(TAGS.DICE_NUMBER);
        this.updateTexture();
    }

    static create(obj, n) {
        return new NumberTile(obj, n);
    }

    updateTexture() {
        switch (this.n) {
            case null: {
                this.obj.getObject3D().material.map = this.prevTexture;
            } break;
            default: {
                const tex = new THREE.TextureLoader().load(
                    'assets/sprites/dirt-gras_128x64_t.png'
                );
                this.obj.getObject3D().material.map = tex;
            } break;
        }
    }

    onEnter() {
        // TODO: player has entered this field
        if (!this.isEmpty()) {
            GAME.logic().addNumber(this.n);
            this.n = null;
            this.updateTexture();
        }
    }

    isEmpty() {
        return this.n === null;
    }
}