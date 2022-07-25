import * as THREE from "three";
import GameObject from "../gameobject";
import GAME from "../../core/globals";
import MODS from "../enums/mods";
import Chance from "chance";

const CELL = Object.freeze({
    EMPTY: -1,
    DEFAULT: 0,
    OBSTACLE: 1,
    COLLECTIBLE: 2,
    GOAL: 3,
    WATER: 4,
    NUMBER: 5,
});

class Tile extends GameObject {

    constructor(pos, celltype=CELL.EMPTY) {
        super(Tile.makeObject3D(pos[0], pos[1], pos[2], celltype));
        // position in the grid as array
        this.position = pos;
        this.cell = celltype;
        this.mods = [];
    }

    static calcRenderOrder(x, y, z, h=1000) {
        return (h-y) * 2;
    }

    static calcRenderOrderPlayer(x, y, z, h=1000) {
        return (h-y) * 2 + 1;
    }

    static calculate3DPosition(x, y, z, cell) {
        const l = GAME.CX();
        const b = GAME.CY();
        switch (cell) {
            case CELL.WATER:
            case CELL.OBSTACLE: return [
                y % 2 == 0 ? l + x : l + 0.5 + x,
                b + y * 0.25 * 0.75 + 0.25,
                z
            ]
            default: return [
                y % 2 == 0 ? l + x : l + 0.5 + x,
                b + y * 0.25 * 0.75,
                z
            ];
        }
    }

    static makeObject3D(x, y, z, cell) {
        const h = cell === CELL.WATER || cell === CELL.OBSTACLE ? 1.0 : 0.5;
        const geometry = new THREE.PlaneGeometry(1, 1);
        const material = new THREE.MeshBasicMaterial({
            map: Tile.textureFromCell(cell),
            transparent: true
        });
        const mesh = new THREE.Mesh(geometry, material);
        const pos = Tile.calculate3DPosition(x, y, z, cell);
        mesh.material.map.center = new THREE.Vector2(0.5, 0.5);
        mesh.position.set(pos[0], pos[1], pos[2]);
        mesh.scale.set(1, h, 1);
        mesh.renderOrder = Tile.calcRenderOrder(x, y, z);

        let rotate;
        switch (cell) {
            case CELL.GOAL:
            case CELL.WATER:
                rotate = false;
            default:
                rotate = Math.random() > 0.5;
        }

        if (rotate) {
            // https://stackoverflow.com/questions/29974578/how-to-flip-a-three-js-texture-horizontally
            mesh.material.map.flipY = false;
            mesh.material.map.rotation = Math.PI;
        }

        return mesh;
    }

    static textureFromCell(cell) {

        switch(cell) {
            case CELL.OBSTACLE: {
                const chance = new Chance();
                const texArray = [
                    'assets/sprites/obstacle_128x127_t.png',
                    'assets/sprites/rock-cracks_128x127_t.png',
                    'assets/sprites/stone_128x127_t.png',
                ];
                return new THREE.TextureLoader().load(chance.pickone(texArray));
            }
            case CELL.GOAL: {
                return new THREE.TextureLoader().load(
                    'assets/sprites/rainbow-goal_128x64_t.png'
                );
            }
            case CELL.WATER: {
                return new THREE.TextureLoader().load(
                    'assets/sprites/water_128x127_t.png'
                );
            }
            case CELL.NUMBER: {
                return new THREE.TextureLoader().load(
                    'assets/sprites/dirt-gras_128x64_t.png'
                );
            }
            default: {
                const chance = new Chance();
                const texArray = [
                    'assets/sprites/full-gras_128x64_t.png',
                    'assets/sprites/stone-cracks_128x64_t.png',
                    'assets/sprites/rock-cracks_128x64_t.png',
                    'assets/sprites/flower-gras_128x64_t.png'
                ];
                return new THREE.TextureLoader().load(chance.pickone(texArray));
            }
        }
    }

    getCellType() {
        return this.cell;
    }

    setCellType(type) {
        // update the cell type
        this.cell = Object.values(CELL).includes(type) ? type : CELL.EMPTY;
        // update the texture
        this.obj3d.material.map = Tile.textureFromCell(this.cell);
        this.obj3d.material.map.center = new THREE.Vector2(0.5, 0.5);
        this.obj3d.material.needsUpdate = true;
        // calculate the 3D position
        const pos = Tile.calculate3DPosition(
            this.position[0],
            this.position[1],
            this.position[2],
            this.cell
        );
        // set the 3D position
        this.obj3d.position.set(pos[0], pos[1], pos[2]);
        // set scale
        const h = this.cell === CELL.WATER || this.cell === CELL.OBSTACLE ? 1.0 : 0.5;
        this.obj3d.scale.set(1, h, 1);
    }

    isCellType(type) {
        return this.cell === type;
    }

    isEmpty() {
        return this.isCellType(CELL.EMPTY);
    }

    setTilePosition(position) {
        this.position = position;
    }

    getTilePosition() {
        return this.position;
    }

    canMoveTo() {
        return !this.isEmpty() &&
            !this.isCellType(CELL.OBSTACLE) &&
            !this.isCellType(CELL.ENEMY);
    }

    addModifier(mod) {
        this.mods.push(mod);
        if (mod === MODS.PLAYER) {
            this.components.forEach(c => c.onEnter());
        }
    }

    removeModifier(mod) {
        this.mods = this.mods.filter(m => m !== mod);
        if (mod === MODS.PLAYER) {
            this.components.forEach(c => c.onLeave());
        }
    }

}

export { Tile as default, CELL }