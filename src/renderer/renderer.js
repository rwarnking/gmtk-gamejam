import * as THREE from 'three';

export default class Renderer {

    constructor() {
        this.readWindowDimension();
        window.addEventListener('resize', () => {
            // clear the timeout
            clearTimeout(this.resizeTimeout);
            // start timing for event "completion"
            this.resizeTimeout = setTimeout(this.readWindowDimension.bind(this), 75);
          });
    }

    readWindowDimension() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        if (this.renderer) {
            this.renderer.setSize(this.width, this.height);
        }
    }

    setupRenderer() {
        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(this.width, this.height);
        document.body.appendChild(this.renderer.domElement);

        this.camera.position.z = 5;
    }

    render(scene) {
        this.renderer.render(scene, this.camera);
    }
}
