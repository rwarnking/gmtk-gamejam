import * as THREE from 'three';

let colorid = 1;

export default class GameObject {

    constructor(object3d) {
        this.id = GameObject.nextColorID();
        this.pickingColor = GameObject.idToColor(this.id);
        this.obj3d = object3d;
        // components that should be called each frame
        this.components = [];
        // components that should only do sth when
        // the gameobject was clicked on
        this.clicked = [];
    }

    static nextColorID() {
        const val = colorid;
        colorid+=1; // TODO: change to increment of 1
        return val;
    }

    static idToColor(id) {
        const r = id % 256;   // red
        const g = (id >> 8) % 256;    // green
        const b = (id >> 16) % 256;           // blue
        return new THREE.Color(r / 255, g  / 255, b / 255);
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
        console.log("GameObject " + this.id + " was clicked")
        this.clicked.forEach(c => c.call(button));
    }
}
