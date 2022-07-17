import * as THREE from 'three';
import TileLevel from '../core/tile-level';
import UI from '../core/ui';
import TAGS from './enums/tags';
import { level2, level3, level4 } from './scenes';

const LEVELS = [
    level2,
    level3,
    level4,
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

        const bgObj = this.objects.find(o => o.hasTag(TAGS.BACKGROUND));
        this.bgObj = bgObj ? bgObj.getComponent("TextureCycle") : null;
        this.setBackground(scene);

        // add dice planes
        const player = this.objects.find(o => o.hasComponent("Dice"));
        if (player) {
            const dice = player.getComponent("Dice")
            dice.getPlanes().forEach(p => this.scene.add(p));
        }
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
        this.level = Math.max(0, index) % LEVELS.length;
        const levelData = LEVELS[this.level]();
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

    removeGameObject(id) {
        const idx = this.objects.findIndex(o => o.id === id);
        if (idx >= 0) {
            this.scene.remove(this.objects[idx].getObject3D());
            this.objects.splice(index, 1);
        }
    }

    updateGameObject3D(object, obj3Dold, obj3Dnew) {
        const idx = this.objects.findIndex(o => o.id === object.id);
        if (idx >= 0) {
            this.scene.remove(obj3Dold);
            this.scene.add(obj3Dnew);
        }
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
