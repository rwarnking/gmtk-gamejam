import * as THREE from 'three';
import TileLevel from '../core/tile-level';

export default class SceneManager {

    constructor() {
        this.objects = [];
        this.scene = null;
        this.scene = new THREE.Scene();
        this.tileLevel = new TileLevel();
    }

    setupScene(level) {
        // clear the scene
        this.scene.clear();
        this.objects = [];
        // create tile game objects in tile-level
        this.tileLevel.initFromArray(
            level.tiles,
            level.width,
            level.height,
            level.depth
        );
        // add the tiles' gameobject3d to our list of objects
        this.tileLevel.forEach(t => this.addGameObject(t));
        // return the scene
        return this.scene;
    }

    addGameObject(object) {
        this.scene.add(object.getObject3D());
        this.objects.push(object);
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
}
