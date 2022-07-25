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

    /**
     * Called when this game object is deleted,
     * in case you want to do sth.
     */
    delete() {}

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

    hasComponent(type) {
        return this.getComponent(type) !== undefined;
    }

    setOject3D(obj3d) {
        this.obj3d = obj3d;
    }

    getObject3D() {
        return this.obj3d;
    }

    hasObject3D() {
        return this.obj3d !== null && this.obj3d !== undefined &&
            this.obj3d !== {};
    }

    forObject3D(callback) {
        if (this.hasObject3D()) {
            callback(this.getObject3D());
        }
        this.components.forEach(c => {
            if (c.hasObjects3D()) {
                c.getObjects3D().forEach(o => callback(o));
            }
        });
    }

    addComponent(component) {
        this.components.push(component);
        return component;
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

    /**
     * This method is called if the GameObject has a Picking Component
     * and was clicked on with the mouse
     * @param {Number} button
     */
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
