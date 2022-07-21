import createFairy from "../logic/prefabs/fairy";
import TextureCycle from "../logic/components/texture-cycle";
import UIElement from "../logic/gameobjects/ui-element";
import GAME from "./globals";

const UI_POSITIONS = [
    [["right", 5], ["top", 3]],
    [["left", 3], ["bottom", 2]],
];
const UI_TEXTURES = [
    "assets/sprites/restart-button_up.png",
    "assets/sprites/fairy2story.png",
];

export default class UI {

    constructor() {
        this.elements = [];
        this.tutorial = true;
    }

    static setPosX(anchor, offset) {
        switch (anchor) {
            default:
            case "left": return -offset;
            case "right": return offset;
        }
    }

    static setPosY(anchor, offset) {
        switch (anchor) {
            default:
            case "top": return offset;
            case "bottom": return -offset;
        }
    }

    init() {
        this.elements = [
            new UIElement(
                UI.setPosX("right", 5),
                UI.setPosY("top", 3),
                UI_TEXTURES[0],
                true
            )
        ];
        const restart = this.elements[0];
        restart.getPicking().setClickFunc(GAME.restartLevel);
        restart.addComponent(TextureCycle.createToggle(
            restart,
            ["assets/sprites/restart-button_up.png", "assets/sprites/restart-button_down.png"],
            150
        ));

        if (this.tutorial) {
            this.tutorial = false;
            this.elements.push(
                createFairy(UI.setPosX("left", 3), UI.setPosX("bottom", 2))
            );
        }
    }

    forEach(callback) {
        this.elements.forEach(ui => callback(ui));
    }

}
