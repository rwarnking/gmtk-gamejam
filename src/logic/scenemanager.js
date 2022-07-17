import * as THREE from 'three';
import TileLevel from '../core/tile-level';
import UIElements from '../core/ui-elements';
import { level2 } from './scenes';

const LEVELS = [
    level2
];

export default class SceneManager {

    constructor() {
        this.objects = [];
        this.scene = new THREE.Scene();
        this.pickingScene = new THREE.Scene();
        this.pickingScene.background = new THREE.Color(0);
        this.tileLevel = new TileLevel();
        this.uiElements = new UIElements();
        this.level = -1;
    }

    setupScene(level) {
        // clear the scene
        this.scene.clear();
        this.pickingScene.clear();
        this.objects = [];
        // create tile game objects in tile-level
        this.tileLevel.initFromArray(
            level.tiles,
            level.width,
            level.height,
            level.depth
        );
        this.uiElements.init();

        // add the tiles' gameobject3d to our list of objects
        this.tileLevel.forEach(t => this.addGameObject(t));
        // add other objects that are not tiles
        level.objects.forEach(o => this.addGameObject(o))

        // add the tiles' gameobject3d to our list of objects
        this.uiElements.forEach(ui => this.addUIElement(ui));

        // return the scene
        return this.scene;
    }

    getScene() {
        return this.scene;
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

    addGameObject(object) {
        if (object.getObject3D()) {
            this.scene.add(object.getObject3D());
        }
        this.objects.push(object);
    }

    addUIElement(object) {
        this.scene.add(object.getObject3D());
        this.objects.push(object);
        this.pickingScene.add(object.getPickingObj());
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
    }

    pickObject(id) {
        for (let i = 0; i < this.objects.length; ++i) {
            if (this.objects[i].id === id) {
                this.objects[i].onClick();
                return;
            }
        }
    }
}
