import * as THREE from 'three';
import GameObject from "../gameobject";
import Picking from "../components/picking";
import TAGS from '../enums/tags';

export default class UIElement extends GameObject {

    constructor(x, y, texture, picking=false) {
        super(UIElement.createSprite(x, y, texture));
        this.addTag(TAGS.UI);
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
        sprite.renderOrder = 2001;
        return sprite;
    }
}
