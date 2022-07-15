import Renderer from "./renderer/renderer";
import SceneManager from "./logic/scenemanager";
import { level1, level2 } from "./logic/scenes";

document.addEventListener("DOMContentLoaded", function() {

    const renderer = new Renderer();
    renderer.setupRenderer();

    const smgr = new SceneManager();
    const scene = smgr.setupScene(level1);
    let last, delta;

    function animate(timestamp) {

        if (last === undefined) {
            last = timestamp;
            delta = 0;
        } else {
            delta = timestamp - last;
        }

        smgr.update(delta);

        renderer.render(scene);

        last = timestamp;
        requestAnimationFrame(animate);
    };

    animate();
});
