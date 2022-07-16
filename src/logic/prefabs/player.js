import * as THREE from 'three';
import GAME from "../../core/globals";
import Inputs from "../../core/inputs";
import Component from "../component";
import TilePosition from "./tile-position";
import GameObject from '../gameobject';

function createPlayer(x, y, z) {

    const texture = new THREE.TextureLoader().load(
        'assets/sprites/die.png'
    );
    const geometry = new THREE.PlaneGeometry(0.25, 0.25);
    const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
    });
    const cube = new THREE.Mesh(geometry, material);
    const obj = new GameObject(cube);

    const tl = GAME.tileLevel();

    // add tile position component
    obj.addComponent(TilePosition.create(obj, x, y, z));

    // input controller component
    obj.addComponent(new Component(obj, function(obj) {
        const tc = obj.getComponent("TilePosition");
        // early return if we are still in the process of moving
        if (tc.isMoving) return;

        // otherwise, check if we can move to the next tile
        if (Inputs.isKeyDown("ArrowUp")) {
            const tile = tl.getTileUp(tc.x, tc.y, tc.z);
            if (tile && tile.canMoveTo()) {
                // go up
                tc.move(tile.getTilePosition());
            }
        } else if (Inputs.isKeyDown("ArrowDown")) {
            const tile = tl.getTileDown(tc.x, tc.y, tc.z);
            if (tile && tile.canMoveTo()) {
                // go down
                tc.move(tile.getTilePosition());
            }
        } else if (Inputs.isKeyDown("ArrowRight")) {
            const tile = tl.getTileRight(tc.x, tc.y, tc.z);
            if (tile && tile.canMoveTo()) {
                // go right
                tc.move(tile.getTilePosition());
            }
        } else if (Inputs.isKeyDown("ArrowLeft")) {
            const tile = tl.getTileLeft(tc.x, tc.y, tc.z);
            if (tile && tile.canMoveTo()) {
                // go left
                tc.move(tile.getTilePosition());
            }
        }
    }));

    return obj;
}

export { createPlayer as default };