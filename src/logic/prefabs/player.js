import * as THREE from 'three';
import GAME from "../../core/globals";
import Inputs from "../../core/inputs";
import Component from "../component";
import TilePosition from "./tile-position";
import GameObject from '../gameobject';
import TAGS from "../enums/tags";
import MODS from '../enums/mods';

function createPlayer(x, y, z, h) {

    const texture = new THREE.TextureLoader().load(
        'assets/3dplayertex.png'
    );

    // const geometry = new THREE.PlaneGeometry(75, 75);
    // const material = new THREE.MeshBasicMaterial({
    //     map: texture,
    //     transparent: true,
    // });

    const geometry = new THREE.BoxGeometry(50, 50, 50);
    // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const material = new THREE.MeshBasicMaterial({
        map: texture,
        // transparent: true,
    });
    const cube = new THREE.Mesh(geometry, material);
    const obj = new GameObject(cube);
    obj.addTag(TAGS.PLAYER);

    const tl = GAME.tileLevel();

    cube.rotation.y = Math.PI * 0.25;
    cube.rotation.x = Math.PI * 0.125;

    obj.addComponent(new Component(obj, function(obj, delta) {
        const obj3d = obj.getObject3D();
        // top left
        // obj3d.position.x -= 0.01 * delta * 1.5;
        // obj3d.position.y += 0.00375 * delta * 1.5;
        // obj3d.rotateX( -0.005 );

        // top right
        // obj3d.position.x += 0.01 * delta * 1.5;
        // obj3d.position.y += 0.00375 * delta * 1.5;
        // obj3d.rotateZ( -0.005 );

        // bot left
        // obj3d.position.x -= 0.01 * delta * 1.5;
        // obj3d.position.y -= 0.00375 * delta * 1.5;
        // obj3d.rotateZ( 0.005 );

        // bot left
        obj3d.position.x += 0.01 * delta * 1.5;
        obj3d.position.y -= 0.00375 * delta * 1.5;
        obj3d.rotateX( 0.005 );
    }));

    // add tile position component
    obj.addComponent(TilePosition.create(
        obj,
        x, y, z
    ));

    // input controller component
    obj.addComponent(new Component(obj, function(obj) {
        const tc = obj.getComponent("TilePosition");
        // early return if we are still in the process of moving
        if (tc.isMoving) return;

        let tile, move = false;
        const currTile = tl.getTile(tc.x, tc.y, tc.z);
        // otherwise, check if we can move to the next tile
        if (Inputs.isKeyDown("ArrowUp")) {
            tile = tl.getTileUp(tc.x, tc.y, tc.z);
            if (tile && tile.canMoveTo()) {
                // go up
                move = true;
            }
        } else if (Inputs.isKeyDown("ArrowDown")) {
            tile = tl.getTileDown(tc.x, tc.y, tc.z);
            if (tile && tile.canMoveTo()) {
                // go down
                move = true;
            }
        } else if (Inputs.isKeyDown("ArrowRight")) {
            tile = tl.getTileRight(tc.x, tc.y, tc.z);
            if (tile && tile.canMoveTo()) {
                // go right
                move = true;
            }
        } else if (Inputs.isKeyDown("ArrowLeft")) {
            tile = tl.getTileLeft(tc.x, tc.y, tc.z);
            if (tile && tile.canMoveTo()) {
                // go left
                move = true;
            }
        }

        if (move) {
            currTile.removeModifier(MODS.PLAYER);
            tc.move(tile.getTilePosition());
            tile.addModifier(MODS.PLAYER)
        }
    }));

    return obj;
}

export { createPlayer as default };
