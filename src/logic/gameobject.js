import * as THREE from 'three';
import { v4 as uuidv4 } from 'uuid';

let colorid = 0;

export default class GameObject {

    constructor(object3d) {
        this.id = uuidv4();
        this.colorid = GameObject.nextColorID();
        this.obj3d = object3d;
        // components that should be called each frame
        this.components = [];
        // components that should only do sth when
        // the gameobject was clicked on
        this.clicked = [];
    }

    static nextColorID() {
        const r = (colorid >> 16) % 256;   // red
        const g = (colorid >> 8) % 256;    // green
        const b = colorid % 256;           // blue
        colorid++;
        return new THREE.Color(r / 256, g  / 256, b / 256);
    }

    setOject3D(obj3d) {
        this.obj3d = obj3d;
    }

    getObject3D() {
        return this.obj3d;
    }

    addComponent(component) {
        this.components.push(component);
    }

    addClickComponent(handler) {
        this.clicked.push(handler);
    }

    /**
     * Updates this GameObject which may modify the Object3D
     * or any of its children. Children must be accessed by
     * asking the top-level Object3D.
     *
     * @param {Number} delta
     */
    update(delta) {
        this.components.forEach(c => c.call(delta));
    }

    onClick(button) {
        this.clicked.forEach(c => c.call(button));
    }
}
