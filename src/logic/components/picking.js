import * as THREE from "three";
import GameObject from "../gameobject";
import Component from "../component";

export default class Picking extends Component {

    constructor(obj, x, y, texture, func=null) {
        super(obj, null, func, "Picking");
        this.x = x;
        this.y = y;
        this.pickingColor = GameObject.idToColor(obj.id);
        this.pickingObj = Picking.makePickingObject(
            x, y, texture, this.pickingColor
        );
    }

    static create(obj, x, y, texture) {
        return new Picking(obj, x, y, texture);
    }

    static makePickingObject(x, y, texPath, color) {
        let texture = new THREE.TextureLoader().load(texPath);
        const geometry = new THREE.PlaneGeometry(1, 1);
        const pickingMaterial = new THREE.MeshPhongMaterial({
            emissive: color,
            color: color,
            specular: new THREE.Color(0, 0, 0),
            map: texture,
            transparent: true,
            side: THREE.DoubleSide,
            alphaTest: 0.5,
            blending: THREE.NoBlending,
        });

        const mesh = new THREE.Mesh(geometry, pickingMaterial);
        mesh.position.set(x, y, 0);
        mesh.renderOrder = 100;
        return mesh;
    }
}
