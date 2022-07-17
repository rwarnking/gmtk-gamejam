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
    // const tiles = makeTileRagged(a, b);
    const chance = new Chance();
    const allIdx = [...Array(a*b).keys()];
    const idx = chance.pickset(allIdx, 3)
    const idxObstacle = chance.pickset(allIdx.filter(i => !idx.includes(i)), 2);

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
            startNumbers: [1],
            goalNumbers: [1,6],
            constraints: [
                CONSTRAINTS.LIKE_REAL_DICE
            ] // TODO: ?!
        }
    };
}


export { level1, level2 };
