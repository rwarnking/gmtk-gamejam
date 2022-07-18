import * as THREE from 'three';
import Events from '../core/events';
import TileLevel from '../core/tile-level';
import UI from '../core/ui';
import TAGS from './enums/tags';
import { level2, level3, level4, level5, level6 } from './scenes';

const LEVELS = [
    { init: level2, w: 6, h: 6 }, // w & h are hard coded to centering works
    { init: level3, w: 7, h: 10 },
    { init: level4, w: 5, h: 6 },
    { init: level5, w: 4, h: 5 },
    { init: level6, w: 7, h: 7 },
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
        this.level = -1;
        this.levelData = null;
        this.bgColor = new THREE.Color(29/255, 133/255, 181/255);
        this.bgObj = null;

        Events.on("removeGameObject", obj => {
            this.removeGameObject(obj);
        })
    }

    setupScene(levelData) {

        this.objects = [];
        // create tile game objects in tile-level
        this.tileLevel.initFromArray(
            levelData.tiles,
            levelData.width,
            levelData.height,
            levelData.depth
        );
        this.ui.init();
        const scene = this.scene.children.length > 0 ? this.nextScene : this.scene;

        // clear the scenes
        scene.clear();
        this.pickingScene.clear();
        // add the tiles' gameobject3d to our list of objects
        this.tileLevel.forEach(t => this.addGameObject(t, scene));
        // add other objects that are not tiles
        levelData.objects.forEach(o => this.addGameObject(o, scene))
        // add the tiles' gameobject3d to our list of objects
        this.ui.forEach(ui => this.addUIElement(ui, scene));

        this.bgObj = null;

        this.objects.forEach(o => {
            if (o.hasComponent("Dice")) {
                // add dice planes
                const dice = o.getComponent("Dice");
                dice.getPlanes().forEach(p => scene.add(p));
            } else if (o.hasComponent("NumberTile")) {
                // add number tile stuff
                const nt = o.getComponent("NumberTile");
                scene.add(nt.topping);
            } else if (o.hasTag(TAGS.BACKGROUND)) {
                // if we have a fancier background
                this.bgObj = o.getComponent("TextureCycle");
            }
        })

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
        if (this.nextScene.children.length > 0) {
            this.scene.clear();
            this.scene = this.nextScene;
            this.nextScene = new THREE.Scene();
        }
    }

    loadLevel(index) {
        if (index >= 0 && index < LEVELS.length) {
            this.level = index;
            Events.emit("setGameDims", {
                w: LEVELS[this.level].w,
                h: LEVELS[this.level].h,
            })
            const levelData = LEVELS[this.level].init();
            this.setupScene(levelData);
            return levelData;
        }
    }

    loadNextLevel() {
        return this.loadLevel(this.level+1)
    }

    restartLevel() {
        return this.loadLevel(this.level);
    }

    addGameObject(object, scene) {
        if (object.hasObject3D()) {
            scene.add(object.getObject3D());
        }
        this.objects.push(object);
    }

    addUIElement(object, scene) {
        if (object.hasObject3D()) {
            scene.add(object.getObject3D());
        }
        this.objects.push(object);
        this.pickingScene.add(object.getPickingObject());
    }

    removeGameObject(obj) {
        if (obj.hasObject3D()) {
            obj.getObject3D().removeFromParent();
        }
        const idx = this.objects.findIndex(o => o.id === obj.id);
        if (idx >= 0) {
            this.objects.splice(idx, 1);
        }
    }

    updateGameObject3D(obj, obj3Dnew) {
        if (obj.hasObject3D()) {
            obj.getObject3D().removeFromParent();
        }
        obj.setObject3D(obj3Dnew);
        this.scene.add(obj3Dnew);
    }

    update(delta) {
        this.objects.forEach(obj => obj.update(delta));
        if (this.bgObj !== null) {
            this.setBackground(this.getScene());
        }
    }

    pickObject(id) {
        for (let i = 0; i < this.objects.length; ++i) {
            if (this.objects[i].hasPicking() && this.objects[i].id === id) {
                this.objects[i].onClick();
                return;
            }
        }
    }
}
