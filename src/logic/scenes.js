import * as THREE from 'three';
import Chance from 'chance';
import GameObject from "./gameobject";
import Tile from "./prefabs/tile";
import TileLevel from '../core/tile-level';
import { CELL } from './prefabs/tile';
import Component from './component';
import Inputs, { MOUSE_BUTTON } from '../core/inputs';
import createPlayer from "./prefabs/player";
import NumberTile from './prefabs/number-tile';
import GoalTile from './prefabs/goal-tile';
import createBackground from './prefabs/background';

import CONSTRAINTS from "./enums/constraints"

function makeTileRect(b, t) {
    const tiles = [];

    let start_x = Math.floor(b/2);
    let start_y = 0;

    for (let x = 0; x < b; x++) {
        let new_x = start_x;
        for (let y = start_y; y < start_y + t; y++) {
            tiles.push(new Tile([new_x, y, 0], CELL.DEFAULT));
            tiles[tiles.length-1].setOject3D(TileLevel.makeTileObject3D(
                new_x, y, 0,
                CELL.DEFAULT,
            ));

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
        tiles[tiles.length-1].setOject3D(TileLevel.makeTileObject3D(
            e[0], e[1], 0,
            CELL.DEFAULT,
        ));
    });
    return tiles;
}

function makeTileRagged(w, h) {
    const tiles = [];

    for (let i = 0; i < w; ++i) {
        for (let j = 0; j < h; ++j) {
            tiles.push(new Tile([i, j, 0], CELL.DEFAULT));
            tiles[tiles.length-1].setOject3D(TileLevel.makeTileObject3D(
                i, j, 0,
                CELL.DEFAULT,
            ));
        }
    }
    return tiles;
}

function setTileToObstacle(t) {
    t.setCellType(CELL.OBSTACLE);
    t.setOject3D(TileLevel.makeTileObject3D(
        t.position[0], t.position[1], 0,
        CELL.OBSTACLE,
    ));
}

function setTileToWater(t) {
    t.setCellType(CELL.OBSTACLE);
    t.setOject3D(TileLevel.makeTileObject3D(
        t.position[0], t.position[1], 0,
        CELL.OBSTACLE,
    ));
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

    TileLevel.initCenter(a, b);

    tiles[16].addComponent(GoalTile.create(tiles[16]));
    tiles[11].addComponent(NumberTile.create(tiles[11], 4));
    tiles[4].addComponent(NumberTile.create(tiles[4], 5));
    tiles[7].addComponent(NumberTile.create(tiles[7], 6));
    const startPos = tiles[19].getTilePosition();

    setTileToObstacle(tiles[3]);

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
            startNumbers: [1,2,3],
            goalNumbers: [1,2,3,4,5,6],
            constraints: [
                // TODO: ?!
                // CONSTRAINTS.LIKE_REAL_DICE
            ]
        }
    };
}

function level3() {
    const a = 6, b = 10;
    const w = Math.max(a, b) * 2, h = Math.max(a, b) * 2;
    const tiles = makeTileRect(a, b);

    TileLevel.initCenter(a, b);

    tiles[47].addComponent(GoalTile.create(tiles[47]));
    tiles[26].addComponent(NumberTile.create(tiles[26], 1));
    tiles[0].addComponent(NumberTile.create(tiles[0], 2));
    tiles[51].addComponent(NumberTile.create(tiles[51], 3));
    tiles[53].addComponent(NumberTile.create(tiles[53], 4));
    const startPos = tiles[11].getTilePosition();

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

    const objects = [
        createPlayer(startPos[0], startPos[1], startPos[2], 1),
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
                // TODO: ?!
                // CONSTRAINTS.LIKE_REAL_DICE
            ]
        }
    };
}

function level4() {
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

    TileLevel.initCenter(w, h);

    tiles[23].addComponent(GoalTile.create(tiles[23]));
    // tiles[15].addComponent(NumberTile.create(tiles[15], 1));
    tiles[28].addComponent(NumberTile.create(tiles[28], 1));
    tiles[33].addComponent(NumberTile.create(tiles[33], 1));
    tiles[17].addComponent(NumberTile.create(tiles[17], 2));
    tiles[9].addComponent(NumberTile.create(tiles[9], 3));
    tiles[36].addComponent(NumberTile.create(tiles[36], 4));
    tiles[30].addComponent(NumberTile.create(tiles[30], 5));
    tiles[22].addComponent(NumberTile.create(tiles[22], 6));
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

    const objects = [
        createPlayer(
            startPos[0], startPos[1], startPos[2]
        ),
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
                // TODO: ?!
                // CONSTRAINTS.LIKE_REAL_DICE
            ]
        }
    };
}

function level5() {
    const a = 8, b = 7;
    const w = Math.max(a, b) * 2, h = Math.max(a, b) * 2;
    const tiles = makeTileRect(a, b);

    TileLevel.initCenter(a, b);

    tiles[6].addComponent(GoalTile.create(tiles[6]));
    tiles[50].addComponent(NumberTile.create(tiles[50], 1));
    tiles[51].addComponent(NumberTile.create(tiles[51], 2));
    tiles[52].addComponent(NumberTile.create(tiles[52], 3));
    tiles[53].addComponent(NumberTile.create(tiles[53], 4));
    tiles[54].addComponent(NumberTile.create(tiles[54], 5));

    tiles[7].addComponent(NumberTile.create(tiles[7], 6));
    tiles[14].addComponent(NumberTile.create(tiles[14], 1));
    tiles[21].addComponent(NumberTile.create(tiles[21], 2));
    tiles[28].addComponent(NumberTile.create(tiles[28], 3));
    tiles[35].addComponent(NumberTile.create(tiles[35], 4));
    tiles[42].addComponent(NumberTile.create(tiles[42], 5));

    tiles[7].addComponent(NumberTile.create(tiles[13], 5));
    tiles[14].addComponent(NumberTile.create(tiles[20], 4));
    tiles[21].addComponent(NumberTile.create(tiles[27], 3));
    tiles[28].addComponent(NumberTile.create(tiles[34], 2));
    tiles[35].addComponent(NumberTile.create(tiles[41], 1));
    tiles[42].addComponent(NumberTile.create(tiles[48], 6));

    tiles[1].addComponent(NumberTile.create(tiles[1], 5));
    tiles[2].addComponent(NumberTile.create(tiles[2], 4));
    tiles[3].addComponent(NumberTile.create(tiles[3], 3));
    tiles[4].addComponent(NumberTile.create(tiles[4], 2));
    tiles[5].addComponent(NumberTile.create(tiles[5], 1));
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
            startNumbers: [1],
            goalNumbers: [1, 2, 3, 4, 5, 6],
            constraints: [
                CONSTRAINTS.LIKE_REAL_DICE
            ] // TODO: ?!
        }
    };
}

export { level1, level2, level3, level4, level5 };
