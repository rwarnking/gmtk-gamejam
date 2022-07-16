
import GAME from './core/globals';
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

    GAME.init();

    animate();
});
