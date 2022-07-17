import * as THREE from 'three';

let colorid = 1;

export default class GameObject {

    constructor(object3d=null) {
        this.id = GameObject.nextColorID();
        this.obj3d = object3d;
        // components
        this.components = [];
        // some tags, to find stuff easier
        this.tags = [];
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

    getComponent(type) {
        return this.components.find(c => c.type === type);
    }

    setOject3D(obj3d) {
        this.obj3d = obj3d;
    }

    getObject3D() {
        return this.obj3d;
    }

    hasObject3D() {
        return this.obj3d !== null;
    }

    addComponent(component) {
        this.components.push(component);
    }

    addTag(tag) {
        this.tags.push(tag);
    }

    removeTag(tag) {
        this.tags = this.tags.fillter(t => t !== tag);
    }

    hasTag(tag) {
        return this.tags.includes(tag);
    }

    /**
     * Updates this GameObject which may modify the Object3D
     * or any of its children. Children must be accessed by
     * asking the top-level Object3D.
     *
     * @param {Number} delta
     */
    update(delta) {
        this.components.forEach(c => c.update(delta));
    }

    onClick(button) {
        this.components.forEach(c => c.click(button));
    }

    addPicking(picker) {
        this.addComponent(picker);
    }

    hasPicking() {
        return this.getPicking() !== undefined;
    }

    getPicking() {
        return this.getComponent("Picking");
    }

    getPickingObject() {
        return this.getComponent("Picking").pickingObj;
    }
}
