import * as THREE from 'three';
import GameObject from "./gameobject";
import Tile, { CELL } from "./gameobjects/tile";
import Component from './component';
import Inputs, { MOUSE_BUTTON } from '../core/inputs';
import createPlayer from "./gameobjects/player";
import NumberTile from './components/number-tile';
import GoalTile from './components/goal-tile';
import createBackground from './prefabs/background';

import CONSTRAINTS from "./enums/constraints"
import WaterTile from './components/water-tile';
import { DICE_POS } from './enums/real-dice';

function makeTileRect(b, t) {
    const tiles = [];

    let start_x = Math.floor(b/2);
    let start_y = 0;

    for (let x = 0; x < b; x++) {
        let new_x = start_x;
        for (let y = start_y; y < start_y + t; y++) {
            tiles.push(new Tile([new_x, y, 0], CELL.DEFAULT));

            if (y % 2 == 1) {
                new_x++;
            }
        }
        if (x % 2 == 0) {
            start_x--;
        }
        start_y++;
    }

    return tiles;
}

function makeTileList(array) {
    const tiles = [];

    array.forEach(e => {
        tiles.push(new Tile([e[0], e[1], 0], CELL.DEFAULT));
    });
    return tiles;
}

function makeTileRagged(w, h) {
    const tiles = [];
    for (let i = 0; i < w; ++i) {
        for (let j = 0; j < h; ++j) {
            tiles.push(new Tile([i, j, 0], CELL.DEFAULT));
        }
    }
    return tiles;
}

function setTileToObstacle(t) {
    t.setCellType(CELL.OBSTACLE);
}

function setTileToWater(t) {
    t.setCellType(CELL.WATER);
    t.addComponent(WaterTile.create(t));
}

function setTileToNumber(t, n) {
    t.setCellType(CELL.NUMBER);
    t.addComponent(NumberTile.create(t, n));
}

function setTileToGoal(t, n) {
    t.setCellType(CELL.GOAL);
    t.addComponent(GoalTile.create(t));
}

function level1() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    const obj = new GameObject(cube);
    // only triggers on click
    obj.addComponent(new Component(obj, null, function(obj, button) {
        if (button === MOUSE_BUTTON.LEFT) {
            obj.toggle = obj.toggle === undefined ? true : !obj.toggle;
            const obj3d = obj.getObject3D();
            obj3d.material.color.setHex(toggle ? 0x00ffff : 0x00ff00);
        }
    }));
    obj.addComponent(new Component(obj, function(obj, delta) {
        const speed = Inputs.isKeyDown("KeyP") ? 0.005 : 0.001;
        const obj3d = obj.getObject3D();
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
    const a = 6, b = 6;
    const w = Math.max(a, b) * 2, h = Math.max(a, b) * 2;
    const tiles = makeTileRect(a, b);

    setTileToObstacle(tiles[3]);
    setTileToNumber(tiles[11], 4);
    setTileToNumber(tiles[4], 5);
    setTileToNumber(tiles[7], 6);
    setTileToGoal(tiles[16]);
    const startPos = tiles[19].getTilePosition();

    const objects = [
        createPlayer(startPos[0], startPos[1], startPos[2], [
            { pos: DICE_POS.BOTTOM,    value: 1 },
            { pos: DICE_POS.LEFT,      value: 2 },
            { pos: DICE_POS.BACK_LEFT, value: 3 },
        ]),
        createBackground()
    ];

    return {
        tiles: tiles,
        objects: objects,
        width: w,
        height: h,
        depth: 1,
        settings: {
            startNumbers: [1,2,3],
            goalNumbers: [1,2,3,4,5,6],
            constraints: [
                CONSTRAINTS.LIKE_REAL_DICE
            ]
        }
    };
}

function level3() {
    const a = 6, b = 10;
    const w = Math.max(a, b) * 2, h = Math.max(a, b) * 2;
    const tiles = makeTileRect(a, b);

    setTileToObstacle(tiles[12]);
    setTileToObstacle(tiles[15]);
    setTileToObstacle(tiles[16]);
    setTileToObstacle(tiles[17]);
    setTileToObstacle(tiles[27]);
    setTileToObstacle(tiles[33]);
    setTileToObstacle(tiles[35]);
    setTileToObstacle(tiles[36]);
    setTileToObstacle(tiles[37]);
    setTileToObstacle(tiles[38]);
    setTileToObstacle(tiles[41]);
    setTileToObstacle(tiles[42]);
    setTileToObstacle(tiles[43]);
    setTileToObstacle(tiles[46]);
    setTileToObstacle(tiles[48]);
    setTileToObstacle(tiles[52]);
    setTileToObstacle(tiles[56]);

    setTileToNumber(tiles[26], 1);
    setTileToNumber(tiles[0],  2);
    setTileToNumber(tiles[51], 3);
    setTileToNumber(tiles[53], 4);

    setTileToGoal(tiles[47]);

    const startPos = tiles[11].getTilePosition();

    const objects = [
        createPlayer(startPos[0], startPos[1], startPos[2], [
            { pos: DICE_POS.BOTTOM, value: 6 },
            { pos: DICE_POS.BACK_RIGHT, value: 5 },
        ]),
        createBackground()
    ];

    return {
        tiles: tiles,
        objects: objects,
        width: w,
        height: h,
        depth: 1,
        settings: {
            startNumbers: [6,5],
            goalNumbers: [1,2,3,4,5,6],
            constraints: [
                CONSTRAINTS.LIKE_REAL_DICE
            ]
        }
    };
}

function level4() {
    const w = 30, h = 30;
    const list = [
        [0, 5], [1, 4], [1, 3], [2, 2],
        [0, 8], [0, 7], [1, 6], [1, 5], [2, 4], [2, 3], [3, 2], [3, 1],
        [0, 10], [0, 9], [1, 8], [1, 7], [3, 4], [3, 3], [4, 2], [4, 1],
        [0, 11], [1, 10], [3, 5], [4, 3], [5, 2],
        [1, 12], [1, 11], [4, 6], [5, 4], [5, 3],
        [1, 13], [2, 12], [2, 11], [3, 10], [4, 7], [5, 6], [5, 5], [6, 4],
        [2, 13], [3, 12], [3, 11], [4, 10], [4, 9], [5, 8], [5, 7], [6, 6],
        [4, 12], [4, 11], [5, 10], [5, 9],
    ];
    const tiles = makeTileList(list);
    const startPos = tiles[1].getTilePosition();

    setTileToObstacle(tiles[7]);
    setTileToObstacle(tiles[15]);
    setTileToObstacle(tiles[17]);
    setTileToObstacle(tiles[20]);
    setTileToObstacle(tiles[30]);
    setTileToObstacle(tiles[32]);
    setTileToObstacle(tiles[35]);
    // setTileToObstacle(tiles[37]);

    setTileToNumber(tiles[10], 1);
    setTileToNumber(tiles[25], 2);
    setTileToNumber(tiles[19], 3);
    setTileToNumber(tiles[34], 4);
    setTileToNumber(tiles[41], 5);
    setTileToNumber(tiles[5],  6);

    setTileToGoal(tiles[48]);

    const objects = [
        createPlayer(startPos[0], startPos[1], startPos[2]),
        createBackground()
    ];

    return {
        tiles: tiles,
        objects: objects,
        width: w,
        height: h,
        depth: 1,
        settings: {
            startNumbers: [],
            goalNumbers: [1,2,3,4,5,6],
            constraints: [
                CONSTRAINTS.LIKE_REAL_DICE
            ]
        }
    };
}

function level5() {
    const w = 15, h = 15;
    const list = [
        [0, 1], [0, 2],
        [1, 1], [1, 2], [0, 3], [0, 4],
        [2, 1], [2, 2], [1, 3], [1, 4], [0, 5], [0, 6],
        [3, 1], [3, 2], [2, 3], [2, 4], [1, 5], [1, 6], [0, 7], [0, 8],
        [4, 2], [3, 3], [3, 4], [2, 5], [2, 6], [1, 7], [1, 8], [0, 9],
        [4, 4], [3, 5], [3, 6], [2, 7], [2, 8], [1, 9],
        [4, 6], [3, 7], [3, 8], [2, 9],
        [3, 9], [4, 8],
    ];
    const tiles = makeTileList(list);
    const startPos = tiles[16].getTilePosition();

    setTileToObstacle(tiles[7]);
    setTileToObstacle(tiles[5]);
    setTileToObstacle(tiles[24]);
    setTileToObstacle(tiles[32]);
    setTileToObstacle(tiles[34]);
    setTileToObstacle(tiles[37]);

    setTileToWater(tiles[0]);
    setTileToWater(tiles[1]);
    setTileToWater(tiles[12]);
    setTileToWater(tiles[15]);
    setTileToWater(tiles[19]);
    setTileToWater(tiles[20]);
    setTileToWater(tiles[27]);
    setTileToWater(tiles[38]);
    setTileToWater(tiles[39]);

    setTileToNumber(tiles[28], 1);
    setTileToNumber(tiles[33], 1);
    setTileToNumber(tiles[17], 2);
    setTileToNumber(tiles[9],  3);
    setTileToNumber(tiles[36], 4);
    setTileToNumber(tiles[30], 5);
    setTileToNumber(tiles[22], 6);

    setTileToGoal(tiles[23]);

    const objects = [
        createPlayer(startPos[0], startPos[1], startPos[2]),
        createBackground()
    ];

    return {
        tiles: tiles,
        objects: objects,
        width: w,
        height: h,
        depth: 1,
        settings: {
            startNumbers: [],
            goalNumbers: [1,2,3,4,5,6],
            constraints: [
                CONSTRAINTS.LIKE_REAL_DICE
            ]
        }
    };
}

function level6() {
    const a = 8, b = 7;
    const w = Math.max(a, b) * 2, h = Math.max(a, b) * 2;
    const tiles = makeTileRect(a, b);

    const startPos = tiles[49].getTilePosition();

    setTileToWater(tiles[0]);
    setTileToWater(tiles[8]);
    setTileToWater(tiles[12]);
    setTileToWater(tiles[16]);
    setTileToWater(tiles[18]);
    setTileToWater(tiles[24]);
    setTileToWater(tiles[31]);
    setTileToWater(tiles[37]);
    setTileToWater(tiles[39]);
    setTileToWater(tiles[43]);
    setTileToWater(tiles[47]);
    setTileToWater(tiles[55]);

    setTileToNumber(tiles[50], 1);
    setTileToNumber(tiles[51], 2);
    setTileToNumber(tiles[52], 3);
    setTileToNumber(tiles[53], 4);
    setTileToNumber(tiles[54], 5);

    setTileToNumber(tiles[14], 1);
    setTileToNumber(tiles[21], 2);
    setTileToNumber(tiles[28], 3);
    setTileToNumber(tiles[35], 4);
    setTileToNumber(tiles[42], 5);
    setTileToNumber(tiles[7],  6);

    setTileToNumber(tiles[13], 5);
    setTileToNumber(tiles[20], 4);
    setTileToNumber(tiles[27], 3);
    setTileToNumber(tiles[34], 2);
    setTileToNumber(tiles[41], 1);
    setTileToNumber(tiles[48], 6);

    setTileToNumber(tiles[1], 5);
    setTileToNumber(tiles[2], 4);
    setTileToNumber(tiles[3], 3);
    setTileToNumber(tiles[4], 2);
    setTileToNumber(tiles[5], 1);

    setTileToGoal(tiles[6]);

    const objects = [
        createPlayer(startPos[0], startPos[1], startPos[2], [
            { pos: DICE_POS.BOTTOM, value: 1 },
        ]),
        createBackground()
    ];

    return {
        tiles: tiles,
        objects: objects,
        width: w,
        height: h,
        depth: 1,
        settings: {
            startNumbers: [1],
            goalNumbers: [1, 2, 3, 4, 5, 6],
            constraints: [
                CONSTRAINTS.LIKE_REAL_DICE
            ]
        }
    };
}

export { level1, level2, level3, level4, level5, level6 };
