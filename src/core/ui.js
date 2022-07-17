import * as THREE from "three"
import Component from "../logic/component";
import TextureCycle from "../logic/prefabs/texture-cycle";
import UIElement from "../logic/prefabs/ui-element";
import GAME from "./globals";

const UI_POSITIONS = [
    // [-2.0, 3.0],
    // [-1.0, 3.0],
    [-3.0, -2.0],
    [2.5, 3.0],
];
const UI_TEXTURES = [
    // "assets/sprites/dice-preview.png",
    // "assets/sprites/dice-goal.png",
    "assets/sprites/fairy2story.png",
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
        const last = this.elements[1];
        last.getPicking()
            .setClickFunc(GAME.restartLevel);
        last.addComponent(TextureCycle.createToggle(
            last,
            ["assets/sprites/restart-button_up.png", "assets/sprites/restart-button_down.png"],
            150
        ));

        const fairy = this.elements[0];
        fairy.getObject3D().scale.set(6, 4, 1);
        const maxLife = 40000, threshold = 1000;
        fairy.life = maxLife;
        fairy.one = false;
        const killComp = new Component(fairy, function(_, delta) {
            fairy.life -= delta;
            if (!fairy.once && fairy.life <= maxLife * 0.5) {
                fairy.once = true;
                fairy.getObject3D().material.map = new THREE.TextureLoader().load("assets/sprites/fairy2wasd.png")
            } else if (fairy.life < threshold) {
                const frac = fairy.life / threshold;
                fairy.getObject3D().material.opacity = frac;
                if (frac <= 0) {
                    fairy.getObject3D().visible = false;
                }
            }
        })
        fairy.addComponent(killComp);

    }

    forEach(callback) {
        this.elements.forEach(ui => callback(ui));
    }
}
