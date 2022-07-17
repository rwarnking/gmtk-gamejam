import TAGS from "../logic/enums/tags";
import AudioListener from "../logic/audio";
import Inputs from "./inputs";

const GAME = (function() {

    let renderer, smgr, logic, audiolistener;

    return {

        init: function(rendererObject, smgrObject, logicObject) {
            renderer = rendererObject;
            renderer.setupRenderer();
            smgr = smgrObject
            logic = logicObject;

            const levelData = smgr.loadNextLevel()
            const player = smgr.objects.find(obj => obj.hasTag(TAGS.PLAYER));
            logic.init(levelData.settings, player);

            audiolistener = new AudioListener();
            //audiolistener.changevolume(0.05);
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

        loadNextLevel: function() {
            logic.reset();
            Inputs.unlockAll();
            const levelData = smgr.loadNextLevel();
            const player = smgr.objects.find(obj => obj.hasTag(TAGS.PLAYER));
            logic.init(levelData.settings, player);
            logic.setPlayer(smgr.objects.find(obj => obj.hasTag(TAGS.PLAYER)))
            setTimeout(() => smgr.applyNextScene(), 500);
        },

        restartLevel: function() {
            logic.reset();
            Inputs.unlockAll();
            const levelData = smgr.restartLevel();
            const player = smgr.objects.find(obj => obj.hasTag(TAGS.PLAYER));
            logic.init(levelData.settings, player);
            setTimeout(() => smgr.applyNextScene(), 500);
        }

    }
}());

export default GAME;
