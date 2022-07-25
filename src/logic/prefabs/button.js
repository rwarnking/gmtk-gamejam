import { MOUSE_BUTTON } from "../../core/inputs";
import TextureCycle from "../components/texture-cycle";
import UIElement from "../gameobjects/ui-element";
import GAME from "../../core/globals";

const SCALE = 0.66;

function createButton(x, y, textures, func) {

    const isArray = Array.isArray(textures);
    const tex = isArray ? textures[0] : textures;
    const button = new UIElement(x, y, tex, true);
    button.getObject3D().scale.set(SCALE, SCALE, 1);
    const picking = button.getPicking();
    picking.setClickFunc(function(obj, button) {
        GAME.audio().playEffect("BUTTON");

        const tc = obj.getComponent("TextureCycle");
        if (!tc) {
            func(obj, button);
        } else {
            const id = setInterval(function() {
                if (!tc.down) {
                    clearInterval(id);
                    func(obj, button);
                }
            }, 50)
        }


    });

    // if we have a button with a "down" texture, add a texture cycler
    if (isArray) {
        button.addComponent(TextureCycle.createToggle(button, textures, 150));
    }

    return button;
}

function createLevelButton(x, y, level, isFinal=false) {

    const name = isFinal ? 'final' : level+1;
    const textures = [
        `assets/sprites/ui/level-${name}_up.png`,
        `assets/sprites/ui/level-${name}_down.png`,
    ];
    const button = createButton(x, y, textures, function(_, mouseButton) {
        if (mouseButton === MOUSE_BUTTON.LEFT) {
            // go to specified level
            GAME.loadLevel(level);
        }
    });

    if (isFinal) {
        button.getObject3D().position.y += 0.166;
        button.getObject3D().scale.set(1.33 * SCALE, 1.5 * SCALE, 1);
    } else {
        button.getObject3D().scale.set(SCALE, SCALE, 1);
    }

    return button;
}

export { createButton as default, createLevelButton };