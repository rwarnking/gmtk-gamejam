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
        'assets/sprites/dice_128x127_t.png'
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
            
            }else{
                GAME.audiolistener().playbump(); 
            }
        } else if (Inputs.isKeyDown("ArrowDown")) {
            tile = tl.getTileDown(tc.x, tc.y, tc.z);
            if (tile && tile.canMoveTo()) {
                // go down
                move = true;
            }else{
                GAME.audiolistener().playbump(); 
            }
        } else if (Inputs.isKeyDown("ArrowRight")) {
            tile = tl.getTileRight(tc.x, tc.y, tc.z);
            if (tile && tile.canMoveTo()) {
                // go right
                move = true;
            }else{
                GAME.audiolistener().playbump(); 
            }
        } else if (Inputs.isKeyDown("ArrowLeft")) {
            tile = tl.getTileLeft(tc.x, tc.y, tc.z);
            if (tile && tile.canMoveTo()) {
                // go left
                move = true;
            }else{
                GAME.audiolistener().playbump(); 
            }
        }

        if (move) {
            currTile.removeModifier(MODS.PLAYER);
            tc.move(tile.getTilePosition());
            tile.addModifier(MODS.PLAYER);
            GAME.audiolistener().playroll();
        }
    }));

    return obj;
}

export { createPlayer as default };