export default class Component {

    constructor(gameobject, uFunc=null, cFunc=null, type="Component") {
        this.type = type;
        this.obj = gameobject;
        this.uFunc = uFunc;
        this.cFunc = cFunc;
    }

    /**
     *
     */
    update(param) {
        if (this.uFunc !== null) {
            this.uFunc(this.obj, param);
        }
    }

    click(param) {
        if (this.cFunc !== null) {
            this.cFunc(this.obj, param);
        }
    }

    onEnter() {}

    onLeave() {}

    setUpdateFunc(func) {
        this.uFunc = func;
    }

    setClickFunc(func) {
        this.cFunc = func;
    }
}