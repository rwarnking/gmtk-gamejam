import * as THREE from 'three';

export default class Renderer {

    constructor() {}

    setupRenderer() {
        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        this.camera.position.z = 5;
    }

    render(scene) {
        this.renderer.render(scene, this.camera);
    }
}
