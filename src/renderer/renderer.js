import * as THREE from 'three';

export default class Renderer {

    constructor() {
        this.readWindowDimension();
        this.pickingTexture = new THREE.WebGLRenderTarget(this.width, this.height);
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
        if (this.camera) {
            // TODO: not sure if this line is necessary
            this.camera.aspect = this.width / this.height;
            this.camera.updateProjectionMatrix();
        }
    }

    setupRenderer() {
        this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.2, 1000);
        this.renderer = new THREE.WebGLRenderer();
        // WHYYYYY
        // this.renderer.sortObjects = false;
        this.renderer.setSize(this.width, this.height);
        document.body.appendChild(this.renderer.domElement);

        this.camera.position.z = 5;
    }

    // initScene(x, y, z) {
    //     this.camera.position.set(x, y, z)
    // }

    render(scene) {
        this.renderer.render(scene, this.camera);
    }

    // https://r105.threejsfundamentals.org/threejs/lessons/threejs-picking.html
    pickingrender(scene, mouse) {
        this.pixelBuffer = new Uint8Array(4);
        // render the scene
        this.renderer.setRenderTarget(this.pickingTexture);
        this.renderer.render(scene, this.camera);
        this.renderer.setRenderTarget(null);

        //read the pixel
        this.renderer.readRenderTargetPixels(
            this.pickingTexture,
            mouse[0],               // x
            this.height-mouse[1],   // y
            1,   // width
            1,   // height
            this.pixelBuffer
        );

        const id =
            (this.pixelBuffer[2] << 16) +
            (this.pixelBuffer[1] <<  8) +
            (this.pixelBuffer[0]);

        return id;
    }
}
