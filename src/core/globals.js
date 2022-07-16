import Renderer from "../renderer/renderer";
import SceneManager from "../logic/scenemanager";
import { level1, level2 } from "../logic/scenes";
import * as THREE from 'three';


const GAME = (function() {

    let renderer, smgr, scene;

    return {

        init: function() {
            renderer = new Renderer();
            renderer.setupRenderer();
            smgr = new SceneManager();
            scene = smgr.setupScene(level2());

            this.audiolistener = new THREE.AudioListener;
        
            var sound = new THREE.Audio(this.audiolistener);
            var loader = new THREE.AudioLoader();
            loader.load('/audio/music.wav',(buffer)=>{
                sound.setBuffer(buffer);
                sound.setLoop(true)
                sound.setVolume(1);
                sound.play();
            });

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