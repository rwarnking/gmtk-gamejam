import * as THREE from 'three';
import GameObject from "../gameobject";
import Picking from "../components/picking";

export default class UIElement extends GameObject {

    constructor(x, y, texture, picking=false) {
        super(UIElement.createSprite(x, y, texture));
        if (picking) {
            this.addComponent(Picking.create(this, x, y, texture))
        }
    }

    static createSprite(x, y, texPath) {
        let texture = new THREE.TextureLoader().load(texPath);
        const material = new THREE.SpriteMaterial({
            map: texture,
        });
        const sprite = new THREE.Sprite(material)
        sprite.position.set(x, y, 0);
        // sprite.scale.set(100,100,1)
        sprite.renderOrder = 2000;
        return sprite;
    }
}
