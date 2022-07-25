import * as THREE from 'three';
import Events from '../core/events';
import { MOUSE_BUTTON } from '../core/inputs';
import TileLevel from '../core/tile-level';
import UI from '../core/ui';
import TAGS from './enums/tags';
import { level2, level3, level4, level5, level6 } from './scenes';

const LEVELS = [
    { init: level2, w: 5.5, h: 2.5 }, // w & h are hard coded to make centering work
    { init: level3, w: 7.5, h: 3 },
    { init: level4, w: 6, h: 3 },
    { init: level5, w: 3.5, h: 2.75 },
    { init: level6, w: 7, h: 3 },
];

export default class SceneManager {

    constructor() {
        this.objects = [];

        this.scene = new THREE.Scene();
        this.nextScene = new THREE.Scene();
        this.pickingScene = new THREE.Scene();
        this.pickingScene.background = new THREE.Color(0);

        this.tileLevel = new TileLevel();

        this.ui = new UI();
        this.ui.init();

        this.level = -1;
        this.levelData = null;

        this.bgColor = new THREE.Color(29/255, 133/255, 181/255);
        this.bgObj = null;

        Events.on("removeGameObject", obj => this.removeGameObject(obj, this.scene));
        Events.on("addGameObject", obj => this.addGameObject(obj, this.scene));

        Events.on("addObject3D", obj => this.scene.add(obj));
        Events.on("removeObject3D", obj => this.scene.remove(obj));
    }

    getCurrentLevelIndex() {
        return this.level;
    }

    setupScene(levelData) {

        this.objects = [];
        const scene = this.nextScene;
        // clear the scene
        this.clearScene(scene);

        // create tile game objects in tile-level
        this.tileLevel.initFromArray(
            levelData.tiles,
            levelData.width,
            levelData.height,
            levelData.depth
        );

        // add the tiles' gameobject3d to our list of objects
        this.tileLevel.forEach(t => this.addGameObject(t, scene));
        // add other objects that are not tiles
        levelData.objects.forEach(o => this.addGameObject(o, scene))
        // add ui objects
        this.ui.forEach(o => this.addGameObject(o, scene))

        this.bgObj = null;
        const bgObj = this.objects.find(o => o.hasTag(TAGS.BACKGROUND));
        if (bgObj !== undefined) {
            // if we have a fancier background
            this.bgObj = bgObj.getComponent("TextureCycle");
        }

        this.setBackground(scene);
    }

    setBackground(scene) {
        scene.background = this.bgObj !== null ?
            this.bgObj.getCurrentTexture() :
            this.bgColor;
    }

    getScene() {
        return this.scene;
    }

    getNextScene() {
        return this.nextScene;
    }

    applyNextScene() {
        this.clearScene(this.scene);
        const prevScene = this.scene;
        this.scene = this.nextScene;
        this.nextScene = prevScene;
    }

    clearScene(scene) {
        scene.clear();
    }

    loadLevel(index) {
        if (index < 0 || index >= LEVELS.length) {
            index = 0;
        }
        console.assert(index >= 0 && index < LEVELS.length, "level out of bounds");
        this.level = index;
        Events.emit("setGameDims", {
            w: LEVELS[this.level].w,
            h: LEVELS[this.level].h,
        })
        const levelData = LEVELS[this.level].init();
        this.setupScene(levelData);
        return levelData;
    }

    loadNextLevel() {
        return this.loadLevel(this.level+1)
    }

    restartLevel() {
        return this.loadLevel(this.level);
    }

    addGameObject(object, scene) {
        object.forObject3D(obj => scene.add(obj));
        this.objects.push(object);
        if (object.hasPicking()) {
            this.pickingScene.add(object.getPickingObject());
        }
    }

    removeGameObject(object, scene) {
        object.forObject3D(obj => scene.remove(obj));
        // check if object has a picking component that needs to be removed
        if (object.hasPicking()) {
            this.pickingScene.remove(object.getPickingObject());
        }

        // remove from object list
        const idx = this.objects.findIndex(o => o.id === object.id);
        if (idx >= 0) {
            this.objects[idx].delete();
            this.objects.splice(idx, 1);
        }
    }

    update(delta) {
        this.objects.forEach(obj => obj.update(delta));
        if (this.bgObj !== null) {
            this.setBackground(this.getScene());
        }
    }

    pickObject(id, button) {
        for (let i = 0; i < this.objects.length; ++i) {
            if (this.objects[i].hasPicking() && this.objects[i].id === id) {
                this.objects[i].onClick(button);
                return;
            }
        }
    }
}
