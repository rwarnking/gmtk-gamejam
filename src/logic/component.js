export default class Component {

    constructor(gameobject, func) {
        this.obj = gameobject;
        this.func = func;
    }

    /**
     *
     */
    call(param) {
        this.func(this.obj, param);
    }
}