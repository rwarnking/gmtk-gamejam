import { v4 as uuidv4 } from 'uuid';

export default class GameObject {

    constructor(object3d) {
        this.id = uuidv4();
        this.obj3d = object3d;
        this.components = [];
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
}
