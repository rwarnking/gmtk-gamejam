import * as THREE from 'three';

export default class SceneManager {

    constructor() {
        this.objects = [];
    }

    setupScene(sceneInit) {
        const scene = new THREE.Scene();
        this.objects = sceneInit();
        this.objects.forEach(obj => scene.add(obj.obj3d));
        return scene;
    }

    update(delta) {
        this.objects.forEach(obj => obj.update(delta));
    }
}
