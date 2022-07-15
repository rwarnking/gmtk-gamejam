import $ from 'cash-dom'

const INPUT_ACTION = Object.freeze({
    UP: 0,
    DOWN: 1
});
const MOUSE_BUTTON = Object.freeze({
    LEFT: 0,
    MIDDLE: 1,
    RIGHT: 2,
    BACK: 3,
    FORWARD: 4,
    NONE: -1,
});

class InputHandler {

    constructor(reactionTime=50) {
        this.reactionTime = reactionTime;
        // init attributes that save data
        this.reset();
        this.map = null;
        // try to get the keyboard map (QWERTY vs. QWERTZ)
        if (navigator.keyboard) {
            navigator.keyboard.getLayoutMap().then(map => this.map = map);
        }
        // register event handlers for key events
        $(window).on("keydown", this.onKeyDown.bind(this));
        $(window).on("keyup", this.onKeyUp.bind(this));
        // register event handlers for mouse events
        $(window).on("mousedown", this.onMouseDown.bind(this));
        $(window).on("mouseup", this.onMouseUp.bind(this));
        $(window).on("mousemove", this.onMouseMove.bind(this));
    }

    reset() {
        this.keys = {};
        this.mouseClick = {};
        Object.values(MOUSE_BUTTON).forEach(b => this.mouseClick[b] = { valid: false });
        this.mouseMove = {};
        this.update();
    }

    update() {
        this.lastFrame = Date.now();
    }

    onTime(time) {
        return Math.abs(time - this.lastFrame) < this.reactionTime;
    }

    onKeyDown(event) {
        this.onKey(event, INPUT_ACTION.DOWN);
    }

    onKeyUp(event) {
        this.onKey(event, INPUT_ACTION.UP);
    }

    onKey(event, action) {
        this.keys[event.code] = {
            key: event.key,
            action: action,
            time: Date.now(),
            shiftKey: event.shiftKey,
            ctrlKey: event.ctrlKey,
            altKey: event.altKey,
            metaKey: event.metaKey,
            repeat: event.repeat
        }
    }

    isKeyDown(key) {
        // if key is currently pressed or the time between key up and the last frame is less than 200ms
        return this.keys[key] !== undefined &&
            (this.keys[key].action === INPUT_ACTION.DOWN || this.onTime(this.keys[key].time))
    }

    isKeyUp(key) {
        return this.keys[key] === undefined || this.keys[key].action === INPUT_ACTION.UP
    }

    onMouseDown(event) {
        this.mouseClick[event.button].valid = true;
        this.onMouse(event, this.mouseClick[event.button]);
    }

    onMouseUp(event) {
        this.mouseClick[event.button].valid = false;
    }

    onMouseMove(event) {
        this.onMouse(event, this.mouseMove);
    }

    onMouse(event, storage) {
        storage.x = event.screenX;
        storage.y = event.screenY;
        storage.shiftKey = event.shiftKey;
        storage.ctrlKey = event.ctrlKey;
        storage.altKey = event.altKey;
        storage.metaKey = event.metaKey;
        storage.button = event.button;
        storage.time = Date.now();
    }

    isMouseButtonDown(button) {
        return this.mouseClick[button].valid || this.onTime(this.mouseClick[button].time);
    }

}

const Inputs = new InputHandler();

export { Inputs as default, MOUSE_BUTTON };