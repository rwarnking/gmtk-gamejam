import * as THREE from 'three';
import GameObject from "./gameobject";

function level1() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    const obj = new GameObject(cube);
    obj.addComponent(obj3d => {
        obj3d.rotation.x += 0.01;
        obj3d.rotation.y += 0.01;
    });
    return [obj];
}

export { level1 };
