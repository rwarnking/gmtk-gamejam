
import GAME from './core/globals';
import Inputs from './core/inputs'

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

    GAME.init();

    animate();
});
