import * as THREE from "three";
import GAME from "../../core/globals";
import Component from "../component";
import TAGS from "../enums/tags";

export default class NumberTile extends Component {

    constructor(obj, n) {
        super(obj, null, null, "NumberTile");
        this.n = n;
        this.direction = null;
        this.topping = NumberTile.makeTopping(n);
        const objpos = obj.getObject3D().position;
        this.topping.position.set(
            objpos.x,
            objpos.y,
            objpos.z,
        );
        this.topping.renderOrder = obj.getObject3D().renderOrder;

        obj.addTag(TAGS.DICE_NUMBER);
        const tex = new THREE.TextureLoader().load(
            'assets/sprites/dirt-gras_128x64_t.png'
        );
        obj.getObject3D().material.map = tex;
        obj.getObject3D().material.needsUpdate = true
    }

    static create(obj, n) {
        return new NumberTile(obj, n);
    }

    static makeTopping(n) {
        const texture = new THREE.TextureLoader().load(
            `assets/sprites/numbers/${n}.png`
        );
        const geometry = new THREE.PlaneGeometry(1, 0.5);
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true
        })
        const plane = new THREE.Mesh(geometry, material);
        return plane;
    }

    onEnter() {
        // player has entered this field and we can collect the number
        if (this.canCollect()) {
            GAME.logic().addNumberDirect(this.n);
            this.collect();
        } else {
            // TODO: should be play a sound?
            // GAME.audio().playEffect("FAIL");
        }
    }

    collect() {
        this.n = null;
        this.topping.removeFromParent();
    }

    canCollect() {
        return !this.isEmpty() && GAME.logic().canAddNumber(this.n);
    }

    isEmpty() {
        return this.n === null;
    }
}