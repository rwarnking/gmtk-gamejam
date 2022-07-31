import TAGS from "../logic/enums/tags";
import AudioManager from "./audio";
import Inputs from "./inputs";
import Events from "./events";
import $ from 'cash-dom'

const GAME = (function() {

    const gameDims = {
        cx: -3,
        cy: -3,
        w: 6,
        h: 6,
    }

    let renderer, smgr, logic, audioMgr;

    return {

        init: function(rendererObject, smgrObject, logicObject) {

            audioMgr = new AudioManager();
            renderer = rendererObject;
            renderer.setupRenderer();
            smgr = smgrObject
            logic = logicObject;

            // try to work around the "cant play sound before interaction" restriction
            let interacted = false;
            const soundWorkaround = () => {
                if (!interacted) {
                    console.log("playing song");
                    interacted = true;
                    audioMgr.init();
                    $(window).off("click", soundWorkaround);
                    $(window).off("keydown", soundWorkaround);
                }
            };
            $(window).on("click", soundWorkaround);
            $(window).on("keydown", soundWorkaround);

            Events.on("setGameDims", this.setGameDims)

            this.loadLevel(0);
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
            if (smgr.getCurrentLevelIndex() === index) {
                return;
            }

            logic.reset();
            Inputs.lockAll();
            const levelData = smgr.loadLevel(index);
            const player = smgr.objects.find(obj => obj.hasTag(TAGS.PLAYER));
            logic.init(levelData.settings, player);
            setTimeout(() => {
                smgr.applyNextScene();
                Inputs.unlockAll();
            }, 200);
        },

        loadNextLevel: function() {
            logic.reset();
            Inputs.lockAll();
            const levelData = smgr.loadNextLevel();
            const player = smgr.objects.find(obj => obj.hasTag(TAGS.PLAYER));
            logic.init(levelData.settings, player);
            setTimeout(() => {
                smgr.applyNextScene();
                Inputs.unlockAll();
            }, 200);
        },

        restartLevel: function() {
            logic.reset();
            Inputs.lockAll();
            const levelData = smgr.restartLevel();
            const player = smgr.objects.find(obj => obj.hasTag(TAGS.PLAYER));
            logic.init(levelData.settings, player);
            setTimeout(() => {
                smgr.applyNextScene();
                Inputs.unlockAll();
            }, 200);
        },

        setGameDims(data) {
            gameDims.w = data.w;
            gameDims.h = data.h;
            // gameDims.cx = -data.w * (data.w === data.h ?
                // 0.5 :
                // (data.w < data.h ? 0.6 : 0.3));
            gameDims.cx = -data.w * 0.5;//data.w < 10 ? Math.floor(-data.w * 0.5) :  Math.floor(-data.w  * 0.5);
            gameDims.cy = -data.h * 0.5;
            renderer.camera.position.z = Math.round(Math.max(data.w, data.h) / 50) + 5;
        },

        CX() {
            return gameDims.cx;
        },

        CY() {
            return gameDims.cy;
        },

        W() {
            return gameDims.w;
        },

        H() {
            return gameDims.h;
        },

    }
}());

export default GAME;
