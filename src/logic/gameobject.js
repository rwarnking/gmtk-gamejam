export default class GameObject {

    constructor(object3d) {
        this.object3d = object3d;
        this.components = [];
    }

    addComponent(component) {
        this.components.push(component);
    }

    /**
     * Updates this GameObject which may modify the Object3D
     * or any of its children. Children must be accessed by
     * asking the top-level Object3D.
     *
     * @param {Number} delta
     */
    update(delta) {
        this.components.forEach(c => c(this.object3d, delta));
    }
}
