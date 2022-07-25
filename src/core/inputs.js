import $ from 'cash-dom'

const INPUT_ACTION = Object.freeze({
    UP: 0,
    DOWN: 1
});
const INPUT_HARDWARE = Object.freeze({
    KEYBOARD: 0,
    MOUSE: 1
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

    constructor(reactionTime=10) {
        this.reactionTime = reactionTime;
        // init attributes that save data
        this.reset();
        // register event handlers for key events
        $(window).on("keydown", this.onKeyDown.bind(this));
        $(window).on("keyup", this.onKeyUp.bind(this));
        // register event handlers for mouse events
        $(window).on("mousedown", this.onMouseDown.bind(this));
        $(window).on("mouseup", this.onMouseUp.bind(this));
        $(window).on("mousemove", this.onMouseMove.bind(this));
    }

    reset() {
        this.lastTime = Date.now();
        this.locks = {};
        Object.values(INPUT_HARDWARE).forEach(h => this.locks[h] = false);
        this.clear();
        this.update();
    }

    clear() {
        this.keys = {};
        this.mouseMove = {};
        this.mouseDown = {};
        this.mouseUp = {};
        Object.values(MOUSE_BUTTON).forEach(b => this.mouseDown[b] = { locked: false });
        Object.values(MOUSE_BUTTON).forEach(b => this.mouseUp[b] = {});
    }

    update() {
        this.lastTime = Date.now();
    }

    onTime(time) {
        return Math.abs(time-this.lastTime) < this.reactionTime;
    }

    onKeyDown(event) {
        if (this.isKeyboardLocked()) return;
        this.onKey(event, INPUT_ACTION.DOWN);
    }

    onKeyUp(event) {
        if (this.isKeyboardLocked()) return;
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
        if (this.isKeyboardLocked()) return false;
        // if key is currently pressed or the time between key up and the last frame is less than 200ms
        return this.keys[key] !== undefined &&
            (this.keys[key].action === INPUT_ACTION.DOWN || this.onTime(this.keys[key].time))
    }

    isKeyUp(key) {
        if (this.isKeyboardLocked()) return true;
        return this.keys[key] === undefined || this.keys[key].action === INPUT_ACTION.UP
    }

    onMouseDown(event) {
        if (this.isMouseLocked()) return;
        this.onMouse(event, this.mouseDown[event.button]);
    }

    onMouseUp(event) {
        this.onMouse(event, this.mouseUp[event.button]);
        this.mouseDown[event.button].locked = false;
    }

    onMouseMove(event) {
        if (this.isMouseLocked()) return;
        this.onMouse(event, this.mouseMove);
    }

    onMouse(event, storage) {
        storage.x = event.pageX;
        storage.y = event.pageY;
        storage.shiftKey = event.shiftKey;
        storage.ctrlKey = event.ctrlKey;
        storage.altKey = event.altKey;
        storage.metaKey = event.metaKey;
        storage.button = event.button;
        storage.time = Date.now();
    }

    isMouseButtonDown(button) {
        if (this.isMouseLocked()) return false;

        if (button === undefined) {
            return Object.values(MOUSE_BUTTON).some(b => this.isMouseButtonDown(b));
        }

        if (!this.mouseDown[button].locked && this.mouseDown[button].time !== undefined) {
            const pressed = this.onTime(this.mouseDown[button].time);

            if (pressed) {
                this.mouseDown[button].locked = true;
                return true;
            }
            return false;
        }
        return false;
    }

    isMouseButtonUp(button) {
        if (this.isMouseLocked()) return true;

        return this.mouseUp[button].time !== undefined &&
            this.onTime(this.mouseUp[button].time);
    }

    getMousePosition(button) {
        if (button === undefined) {
            return [this.mouseMove.x, this.mouseMove.y];
        }
        return [
            this.mouseDown[button].x,
            this.mouseDown[button].y
        ]
    }

    isKeyboardLocked() {
        return this.locks[INPUT_HARDWARE.KEYBOARD];
    }

    isMouseLocked() {
        return this.locks[INPUT_HARDWARE.MOUSE];
    }

    lockKeyboard() {
        this.lockInput(INPUT_HARDWARE.KEYBOARD, true);
    }
    unlockKeyboard() {
        this.lockInput(INPUT_HARDWARE.KEYBOARD, false);
    }

    lockMouse() {
        this.lockInput(INPUT_HARDWARE.MOUSE, true);
    }
    unlockMouse() {
        this.lockInput(INPUT_HARDWARE.MOUSE, false);
    }

    lockAll() {
        this.lockKeyboard();
        this.lockMouse();
    }
    unlockAll() {
        this.unlockKeyboard();
        this.unlockMouse();
    }

    lockInput(hardware, value) {
        this.locks[hardware] = value;
    }

}

const Inputs = new InputHandler();

export { Inputs as default, MOUSE_BUTTON };
