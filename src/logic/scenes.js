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

function makeTileRect(size) {
    const tiles = [];
    // for (let i = 0; i <= x+1; i++) {

    //     if (i > 0 && i <= x) {
    //         tiles.push({
    //             position: [i, i, 0],
    //             type: CELL.DEFAULT
    //         });
    //     }
    //     if (i+2 <= x+1) {
    //         tiles.push({
    //             position: [i, i+2, 0],
    //             type: CELL.DEFAULT
    //         });
    //     }
    //     if (i-2 >= 0) {
    //         tiles.push({
    //             position: [i, i-2, 0],
    //             type: CELL.DEFAULT
    //         });
    //     }
    // }

    // first three
    // tiles.push({
    //     position: [size-2, 1, 0],
    //     type: CELL.DEFAULT
    // });
    // tiles.push({
    //     position: [size-1, 0, 0],
    //     type: CELL.DEFAULT
    // });
    // tiles.push({
    //     position: [size, 1, 0],
    //     type: CELL.DEFAULT
    // });

    // for (let i = 1; i < size-1; i++) {
    //     for (let j = 0; j <= size+1; j++) {
    //         tiles.push({
    //             position: [i, j, 0],
    //             type: CELL.DEFAULT
    //         });
    //     }
    // }

    // // last three
    // tiles.push({
    //     position: [size-1, size-1, 0],
    //     type: CELL.DEFAULT
    // });
    // tiles.push({
    //     position: [size-2, size, 0],
    //     type: CELL.DEFAULT
    // });
    // tiles.push({
    //     position: [size-2, 0, 0],
    //     type: CELL.DEFAULT
    // });


    tiles.push({
        position: [0, 1, 0],
        type: CELL.DEFAULT
    });
    tiles.push({
        position: [0, 2, 0],
        type: CELL.DEFAULT
    });
    tiles.push({
        position: [0, 3, 0],
        type: CELL.DEFAULT
    });
    tiles.push({
        position: [1, 0, 0],
        type: CELL.DEFAULT
    });
    tiles.push({
        position: [1, 1, 0],
        type: CELL.DEFAULT
    });
    tiles.push({
        position: [1, 2, 0],
        type: CELL.DEFAULT
    });
    tiles.push({
        position: [1, 3, 0],
        type: CELL.DEFAULT
    });
    tiles.push({
        position: [1, 4, 0],
        type: CELL.DEFAULT
    });
    tiles.push({
        position: [2, 2, 0],
        type: CELL.DEFAULT
    });
    return tiles;
}

function level1() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    const obj = new GameObject(cube);
    obj.addClickComponent(new Component(obj, function(obj, button) {
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
    const size = 3, w = 5, h = 15;
    let where = 0;
    const tiles = [];
    const chance = new Chance();
    const allIdx = [...Array(w*h).keys()];
    const idx = chance.pickset(allIdx, 2)
    const idxObstacle = chance.pickset(allIdx.filter(i => !idx.includes(i)), 2);

    for (let i = 0; i < w; ++i) {
        for (let j = 0; j < h; ++j) {
            const type = idxObstacle.includes(where) ?
                CELL.OBSTACLE : CELL.DEFAULT;

            tiles.push(new Tile([i, j, 0], type));
            tiles[tiles.length-1].setOject3D(TileLevel.makeTileObject3D(
                i, j, 0,
                type,
            ));
            where++;
        }
    }
    tiles[idx[0]].addComponent(GoalTile.create(tiles[idx[0]]));
    tiles[idx[1]].addComponent(NumberTile.create(tiles[idx[1]], 6));

    const objects = [createPlayer(1, 2, 0)];

    return {
        tiles: tiles,
        objects: objects,
        width: w,
        height: h,
        depth: 1,
        settings: {
            startNumbers: [1],
            goalNumbers: [1,6],
            constraints: [] // TODO: ?!
        }
    };
}


export { level1, level2 };
