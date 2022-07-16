import * as THREE from 'three';
import Tile,{ CELL } from "../logic/tile";

export default class TileLevel {

    constructor() {
        this.tiles = [];
    }

    init(width, height, depth) {
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.tiles = [];

        // from left to right
        for (let i = 0; i < width; ++i) {
            this.tiles.push([]);
            // from bottom to top
            // for (let j = height-1; j >= 0; --j) {
            for (let j = 0; j < height; ++j) {
                this.tiles[i].push([]);
                // from front to back
                for (let k = 0; k <= depth; ++k) {
                    this.tiles[i][this.tiles[i].length-1].push(new Tile([i, j, k]));
                }
            }
        }
    }

    initFromArray(array, width=0, height=0, depth=0) {
        if (this.tiles.length === 0 || (width > 0 && height > 0 && depth > 0)) {
            this.init(width, height, depth);
        }
        array.forEach(tile => {
            // if not empty
            if (tile.type !== CELL.EMPTY) {
                const t = this.getTile(tile.position);
                // set cell type
                t.setCellType(tile.type);
                // set (calculated) 3D position
                t.setTilePosition(tile.position);
                // set object3D / texture
                t.setOject3D(TileLevel.makeTileObject3D(
                    tile.position[0],
                    tile.position[1],
                    tile.position[2],
                    tile.type
                ));
            }
        });
    }

    forEach(callback) {
        // optimal iteration?!: left -> right, back -> front, bottom -> top

        // back to frant
        for (let j = this.tiles[0].length-1; j >= 0; --j) {
            // bottom to top
            for (let k = 0; k < this.tiles[0][0].length; ++k) {
                // left to right
                for (let i = 0; i < this.tiles.length; ++i) {
                    if (!this.tiles[i][j][k].isEmpty()) {
                        callback(this.tiles[i][j][k]);
                    }
                }
            }
        }
    }

    static calculate3DPosition(x, y, z, type) {
        switch (type) {
            case CELL.OBSTACLE: return [
                y % 2 == 0 ? -2 + x : -1.5 + x,
                -2 + y * 0.25 * 0.75 + 0.5,
                z
            ]
            default: return [
                y % 2 == 0 ? -2 + x : -1.5 + x,
                -2 + y * 0.25 * 0.75,
                z
            ];
        }
    }

    static makeTileObject3D(x, y, z, type) {
        let texture, pos, height, rotate = false;

        switch (type) {
            case CELL.OBSTACLE: {
                height = 1.5;
                pos = TileLevel.calculate3DPosition(x, y, z, type)
                texture = new THREE.TextureLoader().load(
                    'assets/sprites/obstacle_01.png'
                );
            } break;
            case CELL.GOAL: {
                height = 0.5;
                pos = TileLevel.calculate3DPosition(x, y, z, type)
                // TODO: remove (LETICIA)
                texture = new THREE.TextureLoader().load('assets/sprites/floor.png');
                // TODO: include (LETICIA)
                // texture = new THREE.TextureLoader().load(
                //     'assets/sprites/rainbow-goal_128x64_t.png'
                // );
            } break;
            default: {
                height = 0.5;
                pos = TileLevel.calculate3DPosition(x, y, z, type)
                const gras = Math.random() > 0.65;
                rotate = Math.random() > 0.5;
                // TODO: remove (LETICIA)
                texture = new THREE.TextureLoader().load('assets/sprites/floor.png');
                // TODO: include (LETICIA)
                // texture = new THREE.TextureLoader().load(
                //     gras ?
                //         'assets/sprites/dirt-gras_128x64_t.png' :
                //         'assets/sprites/stone-cracks_128x64_t.png'
                // );
            } break;
        }

        const geometry = new THREE.PlaneGeometry(1, height);
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(pos[0], pos[1], pos[2]);
        // rotate if so wished
        if (rotate) {
            // https://stackoverflow.com/questions/29974578/how-to-flip-a-three-js-texture-horizontally
            mesh.material.map.flipY = false;
            mesh.material.map.rotation = Math.PI;
            mesh.material.map.center = new THREE.Vector2(0.5, 0.5);
        }
        // set the render order
        mesh.renderOrder = (this.height-y) * 2; // TODO: +z*2 ??!!

        return mesh;
    }

    getTile(pos, y, z) {
        if (Array.isArray(pos)) {
            return this.tiles[pos[0]][pos[1]][pos[2]];
        }
        return this.tiles[x][y][z];
    }

    getTileLeft(pos, y, z) {
        if (Array.isArray(pos)) {
            return this.tiles[Math.max(0,pos[0]-1)][pos[1]][-pos[2]];
        }
        return this.tiles[Math.max(0,x-1)][y][z]
    }

    getTileRight(pos, y, z) {
        if (Array.isArray(pos)) {
            return this.tiles[Math.min(this.width-1,pos[0]+1)][pos[1]][pos[2]];
        }
        return this.tiles[Math.min(this.width-1,x+1)][y][z]
    }

    getTileUp(pos, y, z) {
        if (Array.isArray(pos)) {
            return this.tiles[pos[0]][Math.min(this.height-1,pos[1]+1)][pos[2]];
        }
        return this.tiles[x][Math.min(this.height-1,y+1)][z]
    }

    getTileDown(pos, y, z) {
        if (Array.isArray(pos)) {
            return this.tiles[pos[0]][Math.max(0,pos[1]-1)][pos[2]];
        }
        return this.tiles[x][Math.max(0,y-1)][z]
    }

    getTileBack(pos, y, z) {
        if (Array.isArray(pos)) {
            return this.tiles[pos[0]][pos[1]][Math.min(this.depth-1, this.depth-pos[2]+1)];
        }
        return this.tiles[x][y][Math.min(this.depth-1, this.depth-z+1)]
    }

    getTileFront(pos, y, z) {
        if (Array.isArray(pos)) {
            return this.tiles[pos[0]][pos[1]][Math.max(0, this.depth-pos[2]-1)];
        }
        return this.tiles[x][y][Math.max(0, this.depth-z-1)]
    }

}