import * as THREE from 'three';
import GameObject from "../gameobject";
import Picking from "./picking";

export default class UIElement extends GameObject {

    constructor(x, y, texture) {
        super(UIElement.createUIObject(x, y, texture));
        this.addComponent(Picking.create(this, x, y, texture))
    }

    static createUIObject(x, y, texPath) {
        let texture = new THREE.TextureLoader().load(texPath);
        const material = new THREE.SpriteMaterial({
            map: texture,
        });
        const sprite = new THREE.Sprite(material)
        sprite.position.set(x, y, 0);
        sprite.renderOrder = 1000;
        return sprite;
    }
}
