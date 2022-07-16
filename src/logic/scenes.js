import * as THREE from 'three';
import Chance from 'chance';
import GameObject from "./gameobject";
import { CELL } from './tile';
import Component from './component';
import Inputs, { MOUSE_BUTTON } from '../core/inputs';
import createButton from './prefabs/button';

function level1() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    const obj = new GameObject(cube);
    obj.addComponent(new Component(obj, function(obj, delta) {
        let speed = Inputs.isKeyDown("KeyP") ? 0.005 : 0.001;
        const obj3d = obj.getObject3D();
        if (Inputs.isMouseButtonDown(MOUSE_BUTTON.LEFT)) {
            obj3d.material.color.setHex(0x00ffff);
        } else {
            obj3d.material.color.setHex(0x00ff00);
        }
        obj3d.rotation.x += speed * delta;
        obj3d.rotation.y += speed * delta;
    }));
    return {
        tiles: [],
        objects: [obj],
        width: 1,
        height: 1,
        depth: 1
    };
}

function level2() {
    const w = 5, h = 15;
    const tiles = [];
    for (let i = 0; i < w; ++i) {
        for (let j = 0; j < h; ++j) {
            tiles.push({
                position: [i, j, 0],
                type: CELL.DEFAULT
            });
        }
    }
    const chance = new Chance();
    const indices = chance.pickset([...Array(tiles.length).keys()], 3)
    indices.forEach(i => tiles[i].type = CELL.OBSTACLE);
    tiles[Math.floor(tiles.length*0.5)].type = CELL.GOAL;

    const objects = [];

    return {
        tiles: tiles,
        objects: objects,
        width: w,
        height: h,
        depth: 1
    };
}


export { level1, level2 };
