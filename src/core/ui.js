import UIElement from "../logic/prefabs/ui-element";
import GAME from "./globals";

const UI_POSITIONS = [
    [-2.0, 3.0],
    [-0.5, 3.0],
    [+2.0, 3.0]
];
const UI_TEXTURES = [
    "dice-preview",
    "dice-goal",
    "restart-button_up",
];

export default class UI {

    constructor() {
        this.elements = [];
    }

    init() {
        this.elements = [];
        UI_POSITIONS.forEach((pos, i) => {
            this.elements.push(new UIElement(
                pos[0],
                pos[1],
                UI_TEXTURES[i]
            ));
        })
        this.elements[this.elements.length-1]
            .getPicking()
            .setClickFunc(GAME.restartLevel);
    }

    forEach(callback) {
        this.elements.forEach(ui => callback(ui));
    }
}
