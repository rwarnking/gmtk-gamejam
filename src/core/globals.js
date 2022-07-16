import Renderer from "../renderer/renderer";
import SceneManager from "../logic/scenemanager";
import { level1, level2 } from "../logic/scenes";
import AudioListener from "../logic/audio";
import * as THREE from 'three';


const GAME = (function() {

    let renderer, smgr, scene,audiolistener;

    return {

        init: function() {
            renderer = new Renderer();
            renderer.setupRenderer();
            smgr = new SceneManager();
            scene = smgr.setupScene(level1());

            audiolistener = new AudioListener();    
            audiolistener.changesound();
            audiolistener.changevolume(0.4);
            

        },

        audiolistener: function(){
            return audiolistener;
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