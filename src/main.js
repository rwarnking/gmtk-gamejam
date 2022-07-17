
import GAME from './core/globals';
import Renderer from "./renderer/renderer";
import SceneManager from "./logic/scenemanager";
import Logic from "./logic/logic";
import Inputs, { MOUSE_BUTTON } from './core/inputs'

document.addEventListener("DOMContentLoaded", function() {

    let last, delta, gameOver = false;

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

        // check if game/level is over
        if (!gameOver && GAME.logic().isOver()) {
            gameOver = true;
            console.log("game is over");
            Inputs.clear();
            Inputs.lockKeyboard();

            setTimeout(function() {
                console.log("loading next level");
                gameOver = false;
                GAME.loadNextLevel();
            }, 1000);
        }

        last = timestamp;
        requestAnimationFrame(animate);
    };

    GAME.init(
        new Renderer(),
        new SceneManager(),
        new Logic()
    );

    animate();
});
