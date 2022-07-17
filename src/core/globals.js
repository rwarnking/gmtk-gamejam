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

            logic.setPlayer(smgr.objects.find(obj => obj.hasTag(TAGS.PLAYER)))
            logic.initSettings(levelData.settings);

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
            smgr.loadNextLevel();
        },

    }
}());

export default GAME;
