import TAGS from "../logic/enums/tags";
import AudioManager from "./audio";
import Inputs from "./inputs";

const GAME = (function() {

    let renderer, smgr, logic, audioMgr;

    return {

        init: function(rendererObject, smgrObject, logicObject) {
            renderer = rendererObject;
            renderer.setupRenderer();
            smgr = smgrObject
            logic = logicObject;

            this.loadLevel(0);

            audioMgr = new AudioManager();
        },

        audio: function() {
            return audioMgr;
        },

        renderer: function() {
            return renderer;
        },

        sceneMgr: function() {
            return smgr;
        },

        scene: function() {
            return smgr.getScene();
        },

        tileLevel: function() {
            return smgr.tileLevel;
        },

        logic: function() {
            return logic;
        },

        pickingScene: function() {
            return smgr.pickingScene;
        },

        loadLevel: function(index) {
            logic.reset();
            Inputs.unlockAll();
            const levelData = smgr.loadLevel(index);
            const player = smgr.objects.find(obj => obj.hasTag(TAGS.PLAYER));
            logic.init(levelData.settings, player);
            setTimeout(() => smgr.applyNextScene(), 200);
        },

        loadNextLevel: function() {
            logic.reset();
            Inputs.unlockAll();
            const levelData = smgr.loadNextLevel();
            const player = smgr.objects.find(obj => obj.hasTag(TAGS.PLAYER));
            logic.init(levelData.settings, player);
            setTimeout(() => smgr.applyNextScene(), 200);
        },

        restartLevel: function() {
            logic.reset();
            Inputs.unlockAll();
            const levelData = smgr.restartLevel();
            const player = smgr.objects.find(obj => obj.hasTag(TAGS.PLAYER));
            logic.init(levelData.settings, player);
            setTimeout(() => smgr.applyNextScene(), 200);
        }

    }
}());

export default GAME;
