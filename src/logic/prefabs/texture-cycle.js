import * as THREE from "three";
import Inputs, { MOUSE_BUTTON } from "../../core/inputs";
import Component from "../component";

export default class TextureCycle extends Component {

    constructor(obj, textures, duration, fromStart, ufunc=null, cfunc=null) {
        super(obj, ufunc, cfunc, "TextureCycle");
        this.textures = textures;
        if (typeof(textures[0]) === "string") {
            this.textures = textures.map(t => {
                const tex = new THREE.TextureLoader().load(t)
                tex.center = new THREE.Vector2(0.5, 0.5);
                return tex;
            });
        }
        this.duration = duration;
        this.timeStep = Math.round(this.duration / (textures.length-1));
        this.fromStart = fromStart;
        this.animate = false;
        this.index = 0;
        this.step = 1;
        this.down = false;
        this.backwards = false;
        this.flip = false;
        this.setTexture(this.textures[this.index])
    }

    static createCycle(obj, textures, duration, fromStart=true) {
        return new TextureCycle(obj, textures, duration, fromStart, function() {
            if (this.last === undefined) {
                this.last = Date.now();
            }

            const now = Date.now();
            const d = now - this.last;

            if (d >= this.timeStep) {
                this.setNextTexture();
                this.last = now;
            }
        });
    }

    static createAnimation(obj, textures, duration) {
        return new TextureCycle(obj, textures, duration, true, function() {
            if (this.animate) {

                let once = false;
                if (this.first === undefined) {
                    this.first = Date.now();
                    this.last = this.first;
                    once = true;
                }

                const now = Date.now();
                const d0 = now - this.last;
                const d1 = now - this.first;

                if (d1 <= this.duration) {
                    if (once || d0 >= this.timeStep) {
                        this.setNextTexture();
                        this.last = now;
                    }
                } else {
                    this.last = undefined;
                    this.first = undefined;
                    this.index = 0;
                    this.animate = false;
                    this.flip = false;
                    this.backwards = false;
                    this.step = 1;
                    this.setTexture(this.textures[0])
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

    setAnimate(backwards=false, flip=false) {
        this.backwards = backwards;
        if (backwards) {
            this.index = this.textures.length - 1;
            this.step = -1;
        } else {
            this.index = 0;
            this.step = 1;
        }
        this.flip = flip;
        this.animate = true;
    }

    isAnimating() {
        return this.animate;
    }

    setNextTexture() {
        this.index = this.index + this.step;

        if (this.fromStart) {
            if (this.index > this.textures.length-1 || this.index < 0) {
                this.index = 0;
                this.animate = false;
            }
        } else {
            if (this.index === this.textures.length-1) {
                this.step = -1;
            } else if (this.index === 0) {
                this.step = 1;
            }
        }

        if (this.index === 0 || this.index === this.textures.length-1) {
            this.flip = false;
        }

        this.setTexture(this.textures[this.index])
    }

    setTexture(texture) {
        if (this.obj.hasObject3D()) {

            const material = this.obj.getObject3D().material;
            if (this.flip) {
                texture.wrapS = THREE.RepeatWrapping;
                texture.repeat.x = -1;
            } else {
                texture.wrapS = THREE.ClampToEdgeWrapping;
                texture.repeat.x = 1;
            }
            material.map = texture;
            material.needsUpdate = true;
        }
    }

    getCurrentTexture() {
        return this.textures[this.index];
    }
}
