import * as THREE from 'three';
import GameObject from "./gameobject";
import Component from './components/component';
import Inputs, { MOUSE_BUTTON } from '../core/inputs';

function level3() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    const obj = new GameObject(cube);
    obj.addComponent(new Component(obj, function(obj, delta) {
        let speed = Inputs.isKeyDown("KeyP") ? 0.005 : 0.001;
        if (Inputs.isMouseButtonDown(MOUSE_BUTTON.LEFT)) {
            obj.obj3d.material.color.setHex(0x00ffff);
        } else {
            obj.obj3d.material.color.setHex(0x00ff00);
        }
        obj.obj3d.rotation.x += speed * delta;
        obj.obj3d.rotation.y += speed * delta;
    }));
    return [obj];
}

export { level3 };
