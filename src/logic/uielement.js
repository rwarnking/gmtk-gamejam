import GameObject from "./gameobject";

class UIElement extends GameObject {

    constructor(position) {
        super({});
        // 3D position in the grid as array
        this.position = position;
        // this.pickingobj;
    }

    setPickingObj(pickingobj) {
        this.pickingobj = pickingobj;
        this.pickingobj.material.emissive = this.pickingColor;
    }

    getPickingObj() {
        return this.pickingobj;
    }
}

export { UIElement as default }
