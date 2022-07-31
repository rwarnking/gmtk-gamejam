import * as THREE from "three";
import Events from "../../core/events";
import Component from "../component";
import { DICE_POS } from "../enums/real-dice";

const SCALE = 0.33;
const FACE_POS = [
    [0      ,  0], // BOTTOM
    [1*SCALE,  0], // LEFT
    [2*SCALE,  0], // TOP
    [3*SCALE,  0], // BACK_RIGHT
    [2*SCALE,  1*SCALE], // BACK_LEFT
    [2*SCALE, -1*SCALE], // RIGHT
];

export default class DiceMap extends Component {

    /**
     *
     * @param {GameObject} obj
     * @param {Dice} dice
     * @param {Number} x
     * @param {Number} y
     */
    constructor(obj, eventID, x, y) {
        super(obj, null, null, "DiceMap");
        // reference to the dice component we should map
        this.textures = DiceMap.loadAllTextures();

        // array of visible faces
        for (let i = 0; i < 6; ++i) {
            const material = new THREE.SpriteMaterial({
                map: this.getTexture(0),
                color: DiceMap.getFaceColor(i)
            });
            const sprite = new THREE.Sprite(material);
            sprite.renderOrder = 2000;
            sprite.position.set(x+FACE_POS[i][0], y+FACE_POS[i][1], 0);
            sprite.scale.set(SCALE, SCALE, 1);
            this.objects.push(sprite);
        }

        Events.on(eventID, this.updateTextures.bind(this));
    }

    static create(obj, eventID="playerMoved", x=-1.9, y=2.5) {
        return new DiceMap(obj, eventID, x, y);
    }

    static loadAllTextures() {
        const textures = new Map();
        const loader = new THREE.TextureLoader();
        for (let i = 0; i <= 6; ++i) {
            // normal faces
            let tex = loader.load(`assets/sprites/dice/dice-map-${i}.png`)
            textures.set(""+i, tex);
            // bottom faces
            tex = loader.load(`assets/sprites/dice/dice-map-${i}_bot.png`)
            textures.set("bot_"+i, tex);
            // top faces
            tex = loader.load(`assets/sprites/dice/dice-map-${i}_top.png`)
            textures.set("top_"+i, tex);
        }
        return textures;
    }

    static getFaceColor(position, collected=false) {
        switch(position) {
            case DICE_POS.TOP:
                return 0xffc2c4;
            case DICE_POS.LEFT:
            case DICE_POS.RIGHT:
                return !collected ? 0xdddddd : 0xffffff; //0xf6757a;
            default:
                return !collected ? 0x777777 : 0xbbbbbb;
        }
    }

    getTexture(number, position) {
        number = number === null ? 0 : number
        switch (position) {
            case DICE_POS.BOTTOM:
                return this.textures.get("bot_"+number);
            case DICE_POS.TOP:
                return this.textures.get("top_"+number);
            default:
                return this.textures.get(""+number);
        }
    }

    updateTextures(faces) {
        faces.forEach((obj, pos) => {
            this.objects[pos].material.map = this.getTexture(obj.number, pos);
            this.objects[pos].material.color.setHex(
                DiceMap.getFaceColor(pos, obj.collected)
            );
            this.objects[pos].material.needsUpdate = true;
        });
    }
}
