export default class Component {

    constructor(gameobject, func) {
        this.obj = gameobject;
        this.func = func;
        // TODO
        // this.id = id;
        // this.type = type;
    }

    /**
     *
     */
    call(delta) {
        this.func(this.obj, delta);
    }
}