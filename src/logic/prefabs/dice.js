import * as THREE from "three";
import Component from "../component";
import DIRECTION from "../enums/direction";
import { NEIGHBORS } from "../enums/real-dice";

export default class Dice extends Component {

    constructor(obj, top, func) {
        super(obj, func, null, "Dice");
        this.numbers = new Set();
        // we start with "1" at the top - check with dice-goal.png for reference
        this.top = top;
        this.materials = Dice.getAllTextures();
        this.currTextures = [
            null,
            null,
            null,
        ];
        this.hidden = false;
        this.facePlanes = [];

        for (let j = 0; j < 3; ++j) {
            const geometry = new THREE.PlaneGeometry(0.75, 0.75);
            const plane = new THREE.Mesh(geometry, this.materials[0]);
            plane.renderOrder = 0;
            plane.visible = false;
            this.facePlanes.push(plane);
        }
        this.setPlanePositions()
        this.updateVisibleNumbers();
        this.updateTextures();
    }

    static getAllTextures() {
        const textures = {};
        const loader = new THREE.TextureLoader();
        for (let i = 1; i <= 6; ++i) {
            for (let j = 1; j <= 3; ++j) {
                const tex = loader.load(`assets/sprites/dice/dice-${i}-${j}.png`);
                textures[""+i+"-"+j] = new THREE.MeshBasicMaterial({
                    map: tex,
                    transparent: true,
                });
            }
        }
        return textures;
    }

    static create(obj, top=1) {
        return new Dice(obj, top, function(obj) {
            // get animation component
            const tc = obj.getComponent("TextureCycle");
            // make numbers invisible if we are moving towards a new tile
            if (tc.isAnimating()) {
                this.facePlanes.forEach(plane => plane.visible = false);
                this.hidden = true;
            } else if (this.hidden) {
                this.hidden = false;
                this.setPlanePositions();
                this.facePlanes.forEach(plane => plane.visible = true);

            }
        });
    }

    getTexture(index, number) {
        return this.materials[`${number}-${3-index}`];
    }

    getPlanes() {
        return this.facePlanes;
    }

    setPlanePositions() {
        // get player positon
        const pos = this.obj.getObject3D().position;
        this.facePlanes.forEach(plane => {
            plane.position.set(pos.x-0.001, pos.y+0.007, pos.z);
        })
    }

    goalNumberFromDirection(direction) {
        switch(direction) {
            case DIRECTION.UP:
                return this.top !== 2 ? 5 : 1;
            case DIRECTION.DOWN:
                return this.top !== 5 ? 2 : 1;
            case DIRECTION.LEFT: {
                switch (this.top) {
                    default:
                    case 1: return 4;
                    case 3: return 1;
                    case 6: return 3;
                    case 4: return 1;
                    case 5: return 3;
                    case 2: return 3;
                }
            }
            case DIRECTION.RIGHT: {
                switch (this.top) {
                    default:
                    case 1: return 3;
                    case 3: return 6;
                    case 6: return 3;
                    case 4: return 6;
                    case 5: return 4;
                    case 2: return 4;
                }
            }
        }
    }

    addNumber(number, update=true) {
        this.numbers.add(number);
        if (update) {
            this.updateVisibleNumbers();
            this.updateTextures();
        }
    }

    removeNumber(number, update=true) {
        this.numbers.delete(number);
        if  (update) {
            this.updateVisibleNumbers();
            this.updateTextures();
        }
    }

    move(direction) {
        const n = NEIGHBORS[this.top];
        switch (direction) {
            case DIRECTION.DOWN:
                this.top = n[1]; break;
            case DIRECTION.UP:
                this.top = n[0]; break;
            case DIRECTION.RIGHT:
                this.top = n[2]; break;
            case DIRECTION.LEFT:
                this.top = n[3]; break;
        }
        this.updateVisibleNumbers();
        this.updateTextures()
    }

    cleanAllFaces() {
        this.numbers.clear();
    }

    isNumberVisible(number) {
        const n = NEIGHBORS[this.top];
        return this.top === number || n[0] === number || n[3] === number;
    }

    getVisibleNumbers() {
        const n = NEIGHBORS[this.top];
        return [this.top, n[0], n[3]];
    }

    updateVisibleNumbers() {
        const neighbors = this.getVisibleNumbers();
        const it = neighbors.map(n => this.numbers.has(n) ? n : null);
        this.currTextures = it.map((n, i) => n !== null ? this.getTexture(i,n) : null);
    }

    updateTextures() {
        for (let i = 0; i < 3; ++i) {
            if (this.currTextures[i] !== null) {
                this.facePlanes[i].material = this.currTextures[i];
                this.facePlanes[i].material.needsUpdate = true;
                this.facePlanes[i].visible = true;
            } else {
                this.facePlanes[i].visible = false;
            }
        }
    }
}