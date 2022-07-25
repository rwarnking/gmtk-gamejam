import * as THREE from "three"
import Events from "../../core/events";
import Inputs from "../../core/inputs";
import Component from "../component";
import UIElement from "../gameobjects/ui-element";

export default function createFairy(x, y) {
    const fairy = new UIElement(x, y, "assets/sprites/ui/fairy2story.png", true);

    fairy.getObject3D().scale.set(4, 2.5, 1);
    const maxLife = 40000, threshold = 1000;
    fairy.life = maxLife;
    fairy.once = false;

    const killComp = new Component(fairy, function(_, delta) {

        fairy.life -= delta;

        if (!fairy.once && fairy.life <= maxLife * 0.5) {
            fairy.once = true;
            fairy.getObject3D().material.map = new THREE.TextureLoader().load(
                "assets/sprites/ui/fairy2wasd.png"
            )
        } else if (fairy.life < threshold) {
            const frac = fairy.life / threshold;
            fairy.getObject3D().material.opacity = frac;
            if (frac <= 0) {
                fairy.life = 0;
                Events.emit("removeGameObject", fairy);
            }
        }

        if (Inputs.isKeyDown("KeyW") || Inputs.isKeyDown("KeyA") ||
            Inputs.isKeyDown("KeyS") || Inputs.isKeyDown("KeyD") ||
            Inputs.isMouseButtonDown()
        ) {
            fairy.life = 0;
            Events.emit("removeGameObject", fairy);
        }
    })

    fairy.getPicking().setClickFunc(function() {
        Events.emit("removeGameObject", fairy)
    });
    fairy.addComponent(killComp);
    return fairy;
}