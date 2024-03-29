import * as THREE from 'three';
import GAME from "../../core/globals";

import Inputs from "../../core/inputs";
import GameObject from '../gameobject';
import Component from "../component";

import TilePosition from "../components/tile-position";
import TextureCycle from "../components/texture-cycle";
import Dice from '../components/dice';

import TAGS from "../enums/tags";
import MODS from '../enums/mods';
import DIRECTION from '../enums/direction';
import Events from '../../core/events';

function createPlayer(x, y, z, diceStart) {

    const texture = new THREE.TextureLoader().load(
        'assets/sprites/dice_base_128x127_t.png'
    );
    const geometry = new THREE.PlaneGeometry(0.75, 0.75);
    const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
    });

    // material.depthTest = false;
    // material.depthWrite = false;
    // material.side = THREE.DoubleSide

    const cube = new THREE.Mesh(geometry, material);
    const obj = new GameObject(cube);
    obj.addTag(TAGS.PLAYER);

    const tl = GAME.tileLevel();
    const duration = 350; // move animation duration in ms

    // add tile position component
    obj.addComponent(TilePosition.create(
        obj,
        x, y, z,
        duration
    ));

    // input controller component
    obj.addComponent(new Component(obj, function(obj) {
        const tc = obj.getComponent("TilePosition");
        // early return if we are still in the process of moving
        if (tc.isMoving) return;

        let tile = null;
        let move = false, dir;
        let backwards = false;
        let flip = false;
        const currTile = tl.getTile(tc.x, tc.y, tc.z);
        // otherwise, check if we can move to the next tile
        if (Inputs.isKeyDown("KeyW")) {
            tile = tl.getTileUp(tc.x, tc.y, tc.z);
            if (tile && tile.canMoveTo()) {
                // go up
                move = true;
                dir = DIRECTION.UP;
                flip = true;
            } else {
                GAME.audio().playEffect("BUMP");
            }
        } else if (Inputs.isKeyDown("KeyS")) {
            tile = tl.getTileDown(tc.x, tc.y, tc.z);
            if (tile && tile.canMoveTo()) {
                // go down
                move = true;
                dir = DIRECTION.DOWN;
                backwards = true;
                flip = true;
            } else {
                GAME.audio().playEffect("BUMP");
            }
        } else if (Inputs.isKeyDown("KeyD")) {
            tile = tl.getTileRight(tc.x, tc.y, tc.z);
            if (tile && tile.canMoveTo()) {
                // go right
                move = true;
                backwards = true;
                dir = DIRECTION.RIGHT;
            } else {
                GAME.audio().playEffect("BUMP");
            }
        } else if (Inputs.isKeyDown("KeyA")) {
            tile = tl.getTileLeft(tc.x, tc.y, tc.z);
            if (tile && tile.canMoveTo()) {
                // go left
                move = true;
                dir = DIRECTION.LEFT;
            } else {
                GAME.audio().playEffect("BUMP");
            }
        }

        if (move) {

            if (!tc.isMoving) {
                // CARE: dice component has to move first
                const dice = obj.getComponent("Dice");
                dice.move(dir);
                GAME.audio().playEffect("ROLL");

                tc.move(
                    dir,
                    tile.getTilePosition(),
                    tile.getObject3D().renderOrder+1
                );
                currTile.removeModifier(MODS.PLAYER);
                tile.addModifier(MODS.PLAYER);
                Events.emit("playerMoved", dice.getFaces());

                obj.getComponent("TextureCycle").setAnimate(backwards, flip);
            }
        }
    }));

    // texture cycler for "walking" animation
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
        Math.round(duration * 0.5)
    ));

    let dice;
    if (diceStart) {
        dice = obj.addComponent(Dice.create(obj, diceStart))
    } else {
        dice = obj.addComponent(Dice.create(obj))
    }
    Events.emit("playerMoved", dice.getFaces());

    return obj;
}

export { createPlayer as default };
