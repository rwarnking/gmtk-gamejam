import * as THREE from 'three';
import GameObject from "../gameobject";
import Picking from "./picking";

export default class UIElement extends GameObject {

    constructor(x, y, texture) {
        super(UIElement.createUIObject(x, y, texture));
        this.addComponent(Picking.create(this, x, y, texture))
    }

    static createUIObject(x, y, texName) {
        let texture = new THREE.TextureLoader().load(
            `assets/sprites/${texName}.png`
        );
        const geometry = new THREE.PlaneGeometry(1, 1);
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, 0);
        mesh.renderOrder = 100;
        return mesh;
    }
}
