import * as THREE from "three";
import GAME from "../../core/globals";
import Component from "../component";
import TAGS from "../enums/tags";

export default class NumberTile extends Component {

    constructor(obj, n) {
        super(obj, null, null, "NumberTile");
        this.n = n;
        this.direction = null;
        this.nObj = NumberTile.makeTopping(n);
        this.nObj.renderOrder = obj.getObject3D().renderOrder;
        obj.getObject3D().add(this.nObj);
        obj.addTag(TAGS.DICE_NUMBER);
    }

    static create(obj, n) {
        return new NumberTile(obj, n);
    }

    static makeTopping(n) {
        const texture = new THREE.TextureLoader().load(
            `assets/sprites/numbers/${n}.png`
        );
        const geometry = new THREE.PlaneGeometry(1, 1);
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true
        })
        material.map.center = new THREE.Vector2(0.5, 0.5);
        const plane = new THREE.Mesh(geometry, material);
        return plane;
    }

    onEnter() {
        // player has entered this field and we can collect the number
        if (this.canCollect()) {
            GAME.logic().addNumberDirect(this.n);
            this.collect();
        }
    }

    collect() {
        this.n = null;
        this.nObj.removeFromParent();
    }

    canCollect() {
        return !this.isEmpty() && GAME.logic().canAddNumber(this.n);
    }

    isEmpty() {
        return this.n === null;
    }
}