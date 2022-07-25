import * as THREE from "three";
import Component from "../component";
import DIRECTION from "../enums/direction";
import REAL_DICE, { DICE_POS, DICE_POS_OPP, DICE_MOVE_H, DICE_MOVE_V, decrement, increment } from "../enums/real-dice";

export default class Dice extends Component {

    /**
     *
     * @param {*} obj
     * @param {*} top
     * @param {*} left
     * @param {*} right
     * @param {*} func
     */
    constructor(obj, defined, func) {
        super(obj, func, null, "Dice");
        this.numbers = new Set();
        this.faces = new Map();
        Object.keys(REAL_DICE).forEach(i => this.setNumber(i, null));
        if (defined) {
            this.initFromPreset(defined);
        }

        this.materials = Dice.loadAllTextures();
        this.currTextures = [
            null,
            null,
            null,
        ];
        this.hidden = false;
        this.facePlanes = [];

        for (let j = 0; j < 3; ++j) {
            const material = new THREE.MeshBasicMaterial({
                map: null,
                transparent: true,
            });
            material.opacity = 0;
            const geometry = new THREE.PlaneGeometry(0.75, 0.75);
            const plane = new THREE.Mesh(geometry, material);
            plane.visible = false;
            plane.renderOrder = this.obj.getObject3D().renderOrder;
            this.facePlanes.push(plane);
            this.obj.getObject3D().add(plane);
        }
    }

    static loadAllTextures() {
        const textures = {};
        const loader = new THREE.TextureLoader();
        for (let i = 1; i <= 6; ++i) {
            for (let j = 1; j <= 3; ++j) {
                const tex = loader.load(`assets/sprites/dice/dice-${i}-${j}.png`);
                textures[""+i+"-"+j] = tex;
            }
        }
        return textures;
    }

    static create(obj, defined) {
        return new Dice(obj, defined, function(obj) {
            // get animation component
            const tc = obj.getComponent("TextureCycle");
            // make numbers invisible if we are moving towards a new tile
            if (!this.hidden && tc.isAnimating()) {
                this.facePlanes.forEach(plane => plane.visible = false);
                this.hidden = true;
            } else if (this.hidden && !tc.isAnimating()) {
                this.hidden = false;
                this.facePlanes.forEach(plane => plane.visible = true);
            }
        });
    }

    get top() {
        return this.getNumber(DICE_POS.TOP)
    }
    set top(value) {
        this.setNumber(DICE_POS.TOP, value)
    }

    get left() {
        return this.getNumber(DICE_POS.LEFT)
    }
    set left(value) {
        this.setNumber(DICE_POS.LEFT, value)
    }

    get right() {
        return this.getNumber(DICE_POS.RIGHT)
    }
    set right(value) {
        this.setNumber(DICE_POS.RIGHT, value)
    }

    initFromPreset(defined) {
        defined.forEach(obj => {
            this.setNumber(obj.pos, obj.value);
        });

        Object.keys(DICE_POS).forEach(name => {
            if (this.getNumber(DICE_POS[name]) !== null && this.getNumber(DICE_POS_OPP[name]) === null) {
                this.setNumber(DICE_POS_OPP[name], this.getOppositeNumber(this.getNumber(DICE_POS[name])));
            }
        })
    }

    setNumber(pos, number) {
        this.faces.set(+pos, number);
    }

    getNumber(pos) {
        return this.faces.get(+pos)
    }

    getTexture(number, index) {
        return this.materials[`${number}-${3-index}`];
    }

    moreThanOneBottomOption() {
        if (this.top !== null && this.left !== null && this.right !== null) {
            return false;
        }
        return this.getBottomOptions().length > 1;
    }

    getBottomOptions() {
        // top is already determined
        if (this.top !== null) {
            return [this.getOppositeNumber(this.top)];
        }

        const allNumbers = [1,2,3,4,5,6];
        // only left side is determined
        if (this.left !== null && this.right === null) {
            return allNumbers.filter(n => n!==this.left && n!==7-this.left);
        }
        // only left side is determined
        if (this.right !== null && this.left <= null) {
            return allNumbers.filter(n => n!==this.right && n!==7-this.right);
        }

        return allNumbers.filter(n =>
            n !== this.left  && n !== this.getOppositeNumber(this.left) &&
            n !== this.right && n !== this.getOppositeNumber(this.right)
        );

        // TODO: set top?!
        let top = null;

        // both sides are determined
        switch (this.left+this.right) {
            case 3: // 1 + 2
                top = this.left === 1 ? 4 : 3;
                break;
            case 4: // 3 + 1
                top = this.left === 3 ? 5 : 2;
                break;
            case 5: // 3 + 2, 4 + 1
                top = this.left === 3 ? 1 : (this.left === 1 ? 5 : (this.left === 3 ? 6 : 2))
                break;
            case 6:// 2 + 4, 1 + 5
                top = this.left === 2 ? 1 : (this.left === 1 ? 5 : (this.left === 4 ? 6 : 2))
                break;
            case 8: // 5 + 3, 6 + 2
                top = this.left === 5 ? 1 : (this.left === 1 ? 5 : (this.left === 6 ? 2 : 6));
                break;
            case 9: // 6 + 3, 5 + 4
                top = this.left === 6 ? 5 : (this.left === 5 ? 6 : (this.left === 6 ? 2 : 1));
                break;
            case 10: // 6 + 4
                top = this.left === 6 ? 2 : 5;
                break;
            case 11: // 6 + 5
                top = this.left === 6 ? 4 : 3;
                break;
        }
        return [this.getOppositeNumber(top)]
    }

    getOppositeNumber(number) {
        return 7-number;
    }

    isEmpty() {
        return this.getNumber(DICE_POS.BOTTOM) === null ||
            !this.numbers.has(this.getNumber(DICE_POS.BOTTOM));
    }

    isDefined(number) {
        const l = Array.from(this.faces.values());
        return l.includes(number);
    }

    isDefinedOtherPosition(number) {
        if (this.getNumber(DICE_POS.BOTTOM) === number) {
            return false;
        }
        return this.isDefined(number);
    }

    canAddNumber(number, mustBeOpposite=false) {
        return this.isEmpty() && (!mustBeOpposite || !this.isDefinedOtherPosition(number) &&
            (this.getNumber(DICE_POS.TOP) === null || this.getOppositeNumber(this.getNumber(DICE_POS.TOP)) === number)); // || !this.numbers.has(this.getNumber(DICE_POS.TOP))));
    }

    /**
     * Addes the given number as bottom number
     * @param {*} number
     * @param {*} update
     */
    addNumber(number, update=true) {
        this.addNumberOnly(number);
        if (this.top === null) {
            this.top = this.getOppositeNumber(number);
        }
        this.setNumber(DICE_POS.BOTTOM, number);

        if (update) {
            this.updateTextures();
        }
    }

    addNumberOnly(number) {
        this.numbers.add(number);
    }

    addNumberWithoutPos(number) {
        this.addNumberOnly(number);
        if (!this.isDefined(number)) {
            const names = Object.keys(DICE_POS);
            for (let i = 0; i < names.length; ++i) {
                if (this.getNumber(DICE_POS[names[i]]) === null) {
                    this.setNumber(DICE_POS[names[i]], number);
                    this.setNumber(DICE_POS_OPP[names[i]], this.getOppositeNumber(number));
                    break;
                }
            }
        }
        this.updateTextures();

    }

    /**
     * Removes the current bottom number
     * @param {*} update
     */
    removeNumber(update=true) {
        const number = this.getNumber(DICE_POS.BOTTOM);
        if (number !== null) {
            this.numbers.delete(number);
            if (this.getNumber(DICE_POS.TOP) === null || !this.numbers.has(this.getNumber(DICE_POS.TOP))) {
                this.setNumber(DICE_POS.TOP, null);
                this.setNumber(DICE_POS.BOTTOM, null);
            }
        }
        if  (update) {
            this.updateTextures();
        }
        return number;
    }

    move(direction) {
        const newPos = {};
        let dirName;
        switch (direction) {
            case DIRECTION.RIGHT: // actually right
                dirName = "right";
                DICE_MOVE_V.forEach((pos,i) => {
                    newPos[increment(DICE_MOVE_V, i)] = this.getNumber(pos);
                });
                break;
            case DIRECTION.LEFT: // actually left
                dirName = "left";
                DICE_MOVE_V.forEach((pos,i) => {
                    newPos[decrement(DICE_MOVE_V, i)] = this.getNumber(pos);
                });
                break;
            case DIRECTION.UP: // actually up
                dirName = "up";
                DICE_MOVE_H.forEach((pos,i) => {
                    newPos[increment(DICE_MOVE_H, i)] = this.getNumber(pos);
                });
                break;
            case DIRECTION.DOWN: // actually down
                dirName = "down";
                DICE_MOVE_H.forEach((pos,i) => {
                    newPos[decrement(DICE_MOVE_H, i)] = this.getNumber(pos);
                });
                break;
        }
        Object.entries(newPos).forEach(([pos, number]) => this.setNumber(pos, number));

        this.updateTextures()
    }

    getVisibleNumbers() {
        return [
            this.top,
            this.left,
            this.right
        ]
    }

    getFaces() {
        const map = new Map();
        this.faces.forEach((n, i) => {
            map.set(i, {
                number: n,
                collected: n !== null && this.numbers.has(n)
            });
        });
        return map;
    }

    updateVisibleNumbers() {
        const numbers = this.getVisibleNumbers();
        this.currTextures = numbers.map((n,i) => {
            return n !== null && this.numbers.has(n) ? this.getTexture(n, i) : null
        });
    }

    updateTextures() {
        this.updateVisibleNumbers();
        for (let i = 0; i < 3; ++i) {
            if (this.currTextures[i] !== null) {
                this.facePlanes[i].material.map = this.currTextures[i];
                this.facePlanes[i].material.opacity = 1;
                this.facePlanes[i].material.needsUpdate = true;
                this.facePlanes[i].visible = true; // does not work ?!
            } else {
                this.facePlanes[i].visible = false;
                this.facePlanes[i].material.opacity = 0;
            }
        }
    }
}