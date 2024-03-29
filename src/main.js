
import GAME from './core/globals';
import Renderer from "./renderer/renderer";
import SceneManager from "./logic/scenemanager";
import Logic from "./core/logic";
import Inputs, { MOUSE_BUTTON } from './core/inputs'

document.addEventListener("DOMContentLoaded", function() {

    let last, delta, gameOver = false, loading = false;

    function animate(timestamp) {

        if (last === undefined) {
            last = timestamp;
            delta = 0;
        } else {
            delta = timestamp - last;
        }

        if (!loading) {

            GAME.renderer().render(GAME.scene());
            Inputs.update();
            GAME.sceneMgr().update(delta);
            if (Inputs.isMouseButtonDown(MOUSE_BUTTON.LEFT)) {
                const pickID = GAME.renderer().pickingrender(
                    GAME.pickingScene(),
                    Inputs.getMousePosition(MOUSE_BUTTON.LEFT)
                );
                if (pickID > 0) {
                    GAME.sceneMgr().pickObject(pickID, MOUSE_BUTTON.LEFT);
                }
            }
        }

        // check if game/level is over
        if (!gameOver && GAME.logic().isOver()) {
            GAME.audio().playEffect("WIN");
            gameOver = true;
            console.log("game is over");
            Inputs.clear();
            Inputs.lockKeyboard();

            setTimeout(function() {
                console.log("loading next level");
                loading = true;
                gameOver = false;
                GAME.loadNextLevel();
                loading = false;
            }, 500);
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
