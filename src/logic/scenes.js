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

function level1() {
    const floor = createFloor();

    const ob_positions = [[-0.0, -0.5], [-1.0, 1.5]];
    const obstacles = createObstacles(ob_positions);

    return floor.concat(obstacles);
}

function createFloor() {
    let tiles = [];
    for (let x = -2; x < 3; x++) {
        for (let y = -2; y < 3; y+=0.5) {
            tiles.push(positionObject(floorData(), x, y, 0));
        }
    }
    for (let x = -1.5; x < 3; x++) {
        for (let y = -1.75; y < 3; y+=0.5) {
            tiles.push(positionObject(floorData(), x, y, 0));
        }
    }
    return tiles;
}

function createObstacles(ob_positions) {
    let obstacles = [];
    ob_positions.forEach(d => {
        obstacles.push(
            positionObject(obstacleData(), d[0], d[1], 0)
        );
    })
    return obstacles;
}

function level2() {
    const tiles = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];

    return createTileObjects(tiles);
}

function createTileObjects(tiles) {
    let tileObjects = [];
    tiles.forEach((col, i) => {
        // col.forEach((cell, j) => {
        for (let j = col.length - 1; j > 0; j--) {
            let cell = col[j];

            let x = j % 2 == 0 ? -2 + i : -1.5 + i;
            let y = -2 + j * 0.25;

            switch (cell) {
                case 0:
                    tileObjects.push(
                        positionObject(floorData(), x, y, 0)
                    );
                    break;
                case 1:
                    tileObjects.push(
                        positionObject(obstacleData(), x, y + 0.5, 0)
                    );
                    break;
            }
        }
        // });
    });
    return tileObjects;
}

function positionObject(data, x, y, z) {
    const cube = new THREE.Mesh(data.geometry, data.material);
    cube.position.set(x, y, z);
    return new GameObject(cube);
}

function floorData() {
    const texture = new THREE.TextureLoader().load(
        'assets/sprites/floor.png'
    );

    return {
        geometry: new THREE.PlaneGeometry(1, 0.5),
        material: new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true
        })
    }
}

function obstacleData() {
    const texture = new THREE.TextureLoader().load(
        'assets/sprites/obstacle_01.png'
    );

    return {
        geometry: new THREE.PlaneGeometry(1, 1.5),
        material: new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true
        })
    }
}

export { level1, level2, level3 };
