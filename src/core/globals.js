import TAGS from "../logic/enums/tags";
import AudioListener from "../logic/audio";

const GAME = (function() {

    let renderer, smgr, scene, logic, audiolistener;

    return {

        init: function(render, scenemgr, log, level) {
            renderer = render;
            renderer.setupRenderer();
            smgr = scenemgr
            logic = log;
            scene = smgr.setupScene(level());
            logic.setPlayer(smgr.objects.find(obj => obj.hasTag(TAGS.PLAYER)))

            audiolistener = new AudioListener();
            audiolistener.changesound();
            audiolistener.changevolume(0.05);
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

        tileLevel: function() {
            return smgr.tileLevel;
        },

        logic: function() {
            return logic;
        },

        pickingScene: function() {
            return smgr.pickingScene;
        },

    }
}());

export default GAME;
