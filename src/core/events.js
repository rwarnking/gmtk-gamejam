class EventManager {

    constructor() {
        this.events = {};
    }

    on(name, callback) {
        if (this.events[name]) {
            this.events[name].push(callback);
        } else {
            this.events[name] = [callback];
        }
    }

    off(name, callback) {
        if (this.events[name]) {
            this.events[name] = this.events[name].filter(c => c !== callback);
        }
    }

    emit(name, data) {
        if (this.events[name]) {
            this.events[name].forEach(c => c(data));
        }
    }
}

const Events = new EventManager();

export { Events as default };