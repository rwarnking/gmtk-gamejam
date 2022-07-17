export default class Component {

    constructor(gameobject, func=null, type="Component") {
        this.type = type;
        this.obj = gameobject;
        this.func = func;
    }

    /**
     *
     */
    call(param) {
        if (this.func !== null) {
            this.func(this.obj, param);
        }
    }

    onEnter() {}

    onLeave() {}
}