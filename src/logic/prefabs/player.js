import * as THREE from 'three';
import GAME from "../../core/globals";

import Inputs from "../../core/inputs";
import GameObject from '../gameobject';
import Component from "../component";

import TilePosition from "./tile-position";
import TextureCycle from "./texture-cycle";

import TAGS from "../enums/tags";
import MODS from '../enums/mods';
import DIRECTION from '../enums/direction';

function createPlayer(x, y, z, h) {

    const texture = new THREE.TextureLoader().load(
        'assets/sprites/dice_base_128x127_t.png'
    );
    const geometry = new THREE.PlaneGeometry(0.75, 0.75);
    const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
    });
    const cube = new THREE.Mesh(geometry, material);
    const obj = new GameObject(cube);
    obj.addTag(TAGS.PLAYER);

    const tl = GAME.tileLevel();
    const duration = 500;

    // add tile position component
    obj.addComponent(TilePosition.create(
        obj,
        x, y, z,
        Math.floor(duration * 0.33)
    ));

    // input controller component
    obj.addComponent(new Component(obj, function(obj) {
        const tc = obj.getComponent("TilePosition");
        // early return if we are still in the process of moving
        if (tc.isMoving) return;

        let tile = null;
        let move = false, dir;
        const currTile = tl.getTile(tc.x, tc.y, tc.z);
        // otherwise, check if we can move to the next tile
        if (Inputs.isKeyDown("ArrowUp")) {
            tile = tl.getTileUp(tc.x, tc.y, tc.z);
            if (tile && tile.canMoveTo()) {
                // go up
                move = true;
                dir = DIRECTION.UP;
            }
        } else if (Inputs.isKeyDown("ArrowDown")) {
            tile = tl.getTileDown(tc.x, tc.y, tc.z);
            if (tile && tile.canMoveTo()) {
                // go down
                move = true;
                dir = DIRECTION.DOWN;
            }
        } else if (Inputs.isKeyDown("ArrowRight")) {
            tile = tl.getTileRight(tc.x, tc.y, tc.z);
            if (tile && tile.canMoveTo()) {
                // go right
                move = true;
                dir = DIRECTION.RIGHT;
            }
        } else if (Inputs.isKeyDown("ArrowLeft")) {
            tile = tl.getTileLeft(tc.x, tc.y, tc.z);
            if (tile && tile.canMoveTo()) {
                // go left
                move = true;
                dir = DIRECTION.LEFT;
            }
        }

        if (move) {
            obj.getComponent("TextureCycle").setAnimate();
            currTile.removeModifier(MODS.PLAYER);
            tc.move(dir, tile.getTilePosition(), tile.getObject3D().renderOrder+1);
            tile.addModifier(MODS.PLAYER)
        }
    }));

    obj.addComponent(TextureCycle.createAnimation(
        obj,
        [
            "assets/sprites/dice_base_128x127_t.png",
            "assets/sprites/dice_tl1_128x127.png",
            "assets/sprites/dice_tl2_128x127.png",
            "assets/sprites/dice_tl3_128x127.png",
            "assets/sprites/dice_tl4_128x127.png",
            "assets/sprites/dice_tl5_128x127.png",
        ],
        duration
    ));

    return obj;
}

export { createPlayer as default };