
import GAME from './core/globals';
import Inputs from './core/inputs'
import Renderer from "./renderer/renderer";
import SceneManager from "./logic/scenemanager";
import Logic from "./logic/logic";
import { level1, level2 } from "./logic/scenes";

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
