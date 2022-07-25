import createFairy from "../logic/prefabs/fairy";
import UIElement from "../logic/gameobjects/ui-element";
import GAME from "./globals";
import createButton, { createLevelButton } from "../logic/prefabs/button";
import DiceMap from '../logic/components/dice-map';
import GameObject from "../logic/gameobject";
import { MOUSE_BUTTON } from "./inputs";
import TAGS from "../logic/enums/tags";

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

        this.elements = [];
        // tutorial fairy
        if (this.tutorial) {
            this.tutorial = false;
            this.elements.push(
                createFairy(-2.5, -1.75)
            );
        }

        // level restart button
        this.elements.push(createButton(
            2.5, 2.5,
            [
                "assets/sprites/ui/restart-button_up.png",
                "assets/sprites/ui/restart-button_down.png"
            ],
            function(_, mouseButton) {
                if (mouseButton === MOUSE_BUTTON.LEFT) {
                    GAME.restartLevel();
                }
            }
        ));

        // sound mute button
        this.elements.push(createButton(
            1.75, 2.5,
            [
                "assets/sprites/ui/volume-enabled_up.png",
                "assets/sprites/ui/volume-enabled_down.png",
                "assets/sprites/ui/volume-disabled_up.png",
                "assets/sprites/ui/volume-disabled_down.png",
            ],
            function(_, mouseButton) {
                if (mouseButton === MOUSE_BUTTON.LEFT) {
                    GAME.audio().toggleMute();
                }
            }
        ));

        // game mode toggle button
        this.elements.push(createButton(
            1, 2.5,
            [
                "assets/sprites/ui/mode-puzzle_up.png",
                "assets/sprites/ui/mode-puzzle_down.png",
                "assets/sprites/ui/mode-relax_up.png",
                "assets/sprites/ui/mode-relax_down.png",
            ],
            function(obj, mouseButton) {
                if (obj.puzzles === undefined) {
                    obj.puzzles = false;
                }

                if (mouseButton === MOUSE_BUTTON.LEFT) {
                    GAME.logic().toggleGameMode();
                }
            }
        ));

        const levels = 5;
        // create level buttons and arrows
        for (let i = 0; i < levels; ++i) {
            const final = i === levels-1;
            this.elements.push(createLevelButton(
                -1.75+i,
                -2.5,
                i,
                final
            ));

            // add arrows in between
            if (!final) {
                this.elements.push(new UIElement(
                    -1.75+i+0.45,
                    -2.5,
                    "assets/sprites/ui/arrow-sharp.png"
                ));
                const last = this.elements[this.elements.length-1];
                last.getObject3D().scale.set(0.5, 0.33, 1);
                last.getObject3D().renderOrder = 1950;
            }
        }

        // create dice preview
        const dm  = new GameObject();
        dm.addTag(TAGS.UI);
        dm.addComponent(DiceMap.create(dm));
        this.elements.push(dm);
    }

    forEach(callback) {
        this.elements.forEach(ui => callback(ui));
    }

}
