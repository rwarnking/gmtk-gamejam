import TextureCycle from "../logic/prefabs/texture-cycle";
import UIElement from "../logic/prefabs/ui-element";
import GAME from "./globals";

const UI_POSITIONS = [
    [-2.0, 3.0],
    [-1.0, 3.0],
    [+2.5, 3.0]
];
const UI_TEXTURES = [
    "assets/sprites/dice-preview.png",
    "assets/sprites/dice-goal.png",
    "assets/sprites/restart-button_up.png",
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
        const last = this.elements[this.elements.length-1];

        last.getPicking()
            .setClickFunc(GAME.restartLevel);
        last.addComponent(TextureCycle.createToggle(
            last,
            ["assets/sprites/restart-button_up.png", "assets/sprites/restart-button_down.png"],
            150
        ));
    }

    forEach(callback) {
        this.elements.forEach(ui => callback(ui));
    }
}
