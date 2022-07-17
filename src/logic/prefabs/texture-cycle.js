import * as THREE from "three";
import Inputs, { MOUSE_BUTTON } from "../../core/inputs";
import Component from "../component";

export default class TextureCycle extends Component {

    constructor(obj, textures, duration, ufunc=null, cfunc=null) {
        super(obj, ufunc, cfunc, "TextureCycle");
        this.textures = textures;
        if (typeof(textures[0]) === "string") {
            this.textures = textures.map(t => new THREE.TextureLoader().load(t))
        }
        this.duration = duration;
        console.log(this.duration);
        this.index = 0;
        this.step = 1;
        this.down = false;
        this.setTexture(this.textures[this.index])
    }

    static createCycle(obj, textures, duration) {
        return new TextureCycle(obj, textures, duration, function() {

            if (this.last === undefined) {
                this.last = Date.now();
            }
            const now = Date.now();
            const d = now - this.last;

            if (d >= this.duration) {
                this.setNextTexture();
                this.last = now;
            }
        });
    }

    static createToggle(obj, textures, duration) {
        return new TextureCycle(obj, textures, duration, function() {
            if (this.down && Inputs.isMouseButtonUp(MOUSE_BUTTON.LEFT)) {
                this.down = false;
                this.setNextTexture();
            }
        }, function() {
            this.setNextTexture()
            this.down = !this.down;
        });
    }

    setNextTexture() {
        console.log("next texture");
        if (this.index === this.textures.length-1) {
            this.step = -1;
        } else if (this.index === 0) {
            this.step = 1;
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
