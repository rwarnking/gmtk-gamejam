import * as THREE from "three"
import Component from "../logic/component";
import TextureCycle from "../logic/prefabs/texture-cycle";
import UIElement from "../logic/prefabs/ui-element";
import GAME from "./globals";
import Inputs from "./inputs";

const UI_POSITIONS = [
    // [-2.0, 3.0],
    // [-1.0, 3.0],
    [2.5, 3.0],
    [-3.0, -2.0],
];
const UI_TEXTURES = [
    // "assets/sprites/dice-preview.png",
    // "assets/sprites/dice-goal.png",
    "assets/sprites/restart-button_up.png",
    "assets/sprites/fairy2story.png",
];

export default class UI {

    constructor() {
        this.elements = [];
        this.tutorial = true;
    }

    init() {
        this.elements = [];
        UI_POSITIONS.forEach((pos, i) => {
            if (i !== 1 || this.tutorial) {
                this.elements.push(new UIElement(
                    pos[0],
                    pos[1],
                    UI_TEXTURES[i]
                ));
            }
        })
        const last = this.elements[0];
        last.getPicking()
            .setClickFunc(GAME.restartLevel);
        last.addComponent(TextureCycle.createToggle(
            last,
            ["assets/sprites/restart-button_up.png", "assets/sprites/restart-button_down.png"],
            150
        ));

        if (this.tutorial) {
            this.tutorial = false;
            const fairy = this.elements[1];
            fairy.getObject3D().scale.set(6, 4, 1);
            const maxLife = 40000, threshold = 1000;
            fairy.life = maxLife;
            fairy.one = false;
            const killComp = new Component(fairy, function(_, delta) {
                if (fairy.life <= 0) return;

                fairy.life -= delta;

                if (!fairy.once && fairy.life <= maxLife * 0.5) {
                    fairy.once = true;
                    fairy.getObject3D().material.map = new THREE.TextureLoader().load("assets/sprites/fairy2wasd.png")
                } else if (fairy.life < threshold) {
                    const frac = fairy.life / threshold;
                    fairy.getObject3D().material.opacity = frac;
                    if (frac <= 0) {
                        fairy.getObject3D().removeFromParent();
                    }
                }

                if (Inputs.isKeyDown("KeyW") || Inputs.isKeyDown("KeyA")
                || Inputs.isKeyDown("KeyS") || Inputs.isKeyDown("KeyD")
                ) {
                    fairy.getObject3D().removeFromParent();
                    fairy.dead = true;
                    fairy.life = 0;
                }
            })
            fairy.addComponent(killComp);
        }
    }

    forEach(callback) {
        this.elements.forEach(ui => callback(ui));
    }
}
