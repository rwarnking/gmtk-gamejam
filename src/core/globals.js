import Renderer from "../renderer/renderer";
import SceneManager from "../logic/scenemanager";
import { level2 } from "../logic/scenes";

const GAME = (function() {

    let renderer, smgr, scene;

    return {

        init: function() {
            renderer = new Renderer();
            renderer.setupRenderer();
            smgr = new SceneManager();
            scene = smgr.setupScene(level2());
        },

        renderer: function() {
            return renderer;
        },

        sceneMgr: function() {
            return smgr;
        },

        scene: function() {
            return scene;
        },

    }
}());

export default GAME;