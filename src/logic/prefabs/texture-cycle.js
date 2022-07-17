import * as THREE from "three";
import Inputs, { MOUSE_BUTTON } from "../../core/inputs";
import Component from "../component";

export default class TextureCycle extends Component {

    constructor(obj, textures, duration, fromStart, ufunc=null, cfunc=null) {
        super(obj, ufunc, cfunc, "TextureCycle");
        this.textures = textures;
        if (typeof(textures[0]) === "string") {
            this.textures = textures.map(t => new THREE.TextureLoader().load(t))
        }
        this.duration = duration;
        this.timeStep = this.duration / textures.length;
        this.fromStart = fromStart;
        this.animate = false;
        this.index = 0;
        this.step = 1;
        this.down = false;
        this.setTexture(this.textures[this.index])
    }

    static createCycle(obj, textures, duration, fromStart=true) {
        return new TextureCycle(obj, textures, duration, fromStart, function() {
            if (this.first === undefined) {
                this.first = Date.now();
                this.last = this.first;
            }

            const now = Date.now();
            const d0 = now - this.first;
            const d1 = now - this.last;

            if ((d0 <= this.duration || this.index < this.textures.length-1) && d1 >= this.timeStep) {
                this.setNextTexture();
                this.last = now;
            }
        });
    }

    static createAnimation(obj, textures, duration) {
        return new TextureCycle(obj, textures, duration, true, function() {

            if (this.animate) {

                if (this.first === undefined) {
                    this.first = Date.now();
                    this.last = this.first;
                }

                const now = Date.now();
                const d1 = now - this.last;

                if (this.index < this.textures.length && d1 >= this.timeStep) {
                    this.setNextTexture();
                    this.last = now;
                    if (!this.animate) {
                        this.setTexture(this.textures[0])
                    }
                }
            }

        });
    }

    static createToggle(obj, textures, duration, fromStart=true) {
        return new TextureCycle(obj, textures, duration, fromStart, function() {
            if (this.down && Inputs.isMouseButtonUp(MOUSE_BUTTON.LEFT)) {
                this.down = false;
                this.setNextTexture();
            }
        }, function() {
            this.setNextTexture()
            this.down = !this.down;
        });
    }

    setAnimate() {
        this.animate = true;
    }

    isAnimating() {
        return this.animate;
    }

    setNextTexture() {
        if (this.fromStart) {
            if (this.index === this.textures.length-1) {
                this.index = 0;
                this.step = 1;
                this.animate = false;
                this.first = undefined;
            }
        } else {
            if (this.index === this.textures.length-1) {
                this.step = -1;
            } else if (this.index === 0) {
                this.step = 1;
            }
        }

        this.index = this.index + this.step;
        this.setTexture(this.textures[this.index])
    }

    setTexture(texture) {
        if (this.obj.hasObject3D()) {
            this.obj.getObject3D().material.map = texture;
            this.obj.getObject3D().material.needsUpdate = true;
        }
    }

    getCurrentTexture() {
        return this.textures[this.index];
    }
}
