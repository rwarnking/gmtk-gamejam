
import GAME from './core/globals';
import Renderer from "./renderer/renderer";
import SceneManager from "./logic/scenemanager";
import Logic from "./logic/logic";
import { level1, level2 } from "./logic/scenes";
import Inputs, { MOUSE_BUTTON } from './core/inputs'

document.addEventListener("DOMContentLoaded", function() {

    let last, delta;

    function animate(timestamp) {

        if (last === undefined) {
            last = timestamp;
            delta = 0;
        } else {
            delta = timestamp - last;
        }

        Inputs.update();
        GAME.sceneMgr().update(delta);
        GAME.renderer().render(GAME.scene());
        if (Inputs.isMouseButtonDown(MOUSE_BUTTON.LEFT)) {
            const pickeid = GAME.renderer().pickingrender(
                GAME.pickingScene(),
                Inputs.getMousePosition(MOUSE_BUTTON.LEFT)
            );
            if (pickeid > 0) {
                GAME.sceneMgr().pickObject(pickeid, MOUSE_BUTTON.LEFT);
            }
        }

        last = timestamp;
        requestAnimationFrame(animate);
    };

    GAME.init(
        new Renderer(),
        new SceneManager(),
        new Logic(),
        level2
    );

    animate();
});
