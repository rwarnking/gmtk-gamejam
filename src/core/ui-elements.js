import * as THREE from 'three';
import UIElement from "../logic/uielement";

export default class UIElements {

    constructor() {
        this.uielems = [];
    }

    init() {
        let UIPositions = [
            [-2.0, 3.0],
            [-1.0, 3.0],
            [+2.0, 3.0],
        ]

        UIPositions.forEach(pos => {
            let ui = new UIElement();
            ui.setOject3D(UIElements.makeUIElement(
                pos[0],
                pos[1],
                0
            ));
            ui.setPickingObj(UIElements.makePickingElement(
                pos[0],
                pos[1],
                0
            ));
            this.uielems.push(
                ui
            );
        })
    }

    static makeUIElement(x, y) {
        let texture = new THREE.TextureLoader().load(
            'assets/sprites/obstacle_01.png'
        );

        const geometry = new THREE.PlaneGeometry(1, 1);
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, 0);
        mesh.renderOrder = 100;
        return mesh;
    }

    static makePickingElement(x, y, z) {
        let texture = new THREE.TextureLoader().load(
            'assets/sprites/obstacle_01.png'
        );
        const geometry = new THREE.PlaneGeometry(1, 1);
        const pickingMaterial = new THREE.MeshPhongMaterial({
            emissive: new THREE.Color(0, 0, 0),
            color: new THREE.Color(0, 0, 1),
            specular: new THREE.Color(0, 0, 0),
            map: texture,
            transparent: true,
            side: THREE.DoubleSide,
            alphaTest: 0.5,
            blending: THREE.NoBlending,
        });

        const mesh = new THREE.Mesh(geometry, pickingMaterial);
        mesh.position.set(x, y, z);
        return mesh;
    }

    forEach(callback) {
        for (let i = 0; i < this.uielems.length; ++i) {
            callback(this.uielems[i]);
        }
    }
}
