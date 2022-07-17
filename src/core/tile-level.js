import * as THREE from 'three';
import Tile, { CELL } from "../logic/tile";

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
                const t = this.getTile(
                    tile.position[0],
                    tile.position[1],
                    tile.position[2]
                );
                // set cell type
                t.setCellType(tile.type);
                // set (calculated) 3D position
                t.setTilePosition(tile.position);
                // set object3D / texture
                t.setOject3D(TileLevel.makeTileObject3D(
                    tile.position[0],
                    tile.position[1],
                    tile.position[2],
                    tile.type,
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

    static calcRenderOrder(x, y, z) {
        return (-y) * 2 * 100;
    }

    static calculate3DPosition(x, y, z, type=CELL.DEFAULT) {
        const scale = 100; // TODO save this elsewhere
        switch (type) {
            case CELL.OBSTACLE: return [
                y % 2 == 0 ? (-2 + x) * scale : (-1.5 + x) * scale,
                (-2 + y * 0.25 * 0.75 + 0.5 * 0.75) * scale,
                -scale // TODO z no used
            ]
            default: return [
                y % 2 == 0 ?
                    (-2 + x) * scale :
                    (-1.5 + x) * scale,
                -2 * scale + y * 0.25 * 0.75 * scale,
                -scale // TODO z no used
            ];
        }
    }

    static makeTileObject3D(x, y, z, type) {
        let texture, pos, height, rotate = false;

        switch (type) {
            case CELL.OBSTACLE: {
                height = 1.0;
                pos = TileLevel.calculate3DPosition(x, y, z, type)
                texture = new THREE.TextureLoader().load(
                    'assets/sprites/obstacle_01.png'
                );
            } break;
            case CELL.GOAL: {
                height = 0.5;
                pos = TileLevel.calculate3DPosition(x, y, z, type)
                texture = new THREE.TextureLoader().load(
                    'assets/sprites/rainbow-goal_128x64_t.png'
                );
            } break;
            default: {
                height = 0.5;
                pos = TileLevel.calculate3DPosition(x, y, z, type)
                const gras = Math.random() > 0.65;
                rotate = Math.random() > 0.5;
                texture = new THREE.TextureLoader().load(
                    gras ?
                        'assets/sprites/dirt-gras_128x64_t.png' :
                        'assets/sprites/stone-cracks_128x64_t.png'
                );
            } break;
        }

        const geometry = new THREE.PlaneGeometry(100, height*100);
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(pos[0], pos[1], pos[2]);
        mesh.material.map.center = new THREE.Vector2(0.5, 0.5);

        // rotate if so wished
        if (rotate) {
            // https://stackoverflow.com/questions/29974578/how-to-flip-a-three-js-texture-horizontally
            mesh.material.map.flipY = false;
            mesh.material.map.rotation = Math.PI;
        }
        // set the render order
        mesh.renderOrder = TileLevel.calcRenderOrder(x, y, z); // TODO: +z*2 ??!!

        return mesh;
    }

    getTile(x, y, z) {
        return this.tiles[x][y][z];
    }

    getTileLeft(pos, y, z) {
        if (Array.isArray(pos)) {
            y = pos[1];
            z = pos[2];
        }

        const extra = y % 2 === 1 ? 1 : 0;
        if (((pos+extra) === 0 || y === this.height-1)) return null;

        return this.getTile(
            pos - 1 + extra,
            y + 1,
            z
        );
    }

    getTileRight(pos, y, z) {
        if (Array.isArray(pos)) {
            y = pos[1];
            z = pos[2];
        }

        const extra = y % 2 === 1 ? 0 : 1;
        if (((pos-extra) === this.width-1 || y === 0)) return null;

        return this.getTile(
            pos + 1 - extra,
            y - 1,
            z
        );
    }

    getTileUp(pos, y, z) {
        if (Array.isArray(pos)) {
            y = pos[1];
            z = pos[2];
        }

        const extra = y % 2 === 1 ? 0 : 1;
        if (((pos-extra) === this.width-1 || y === this.height-1)) return null;

        return this.getTile(
            pos + 1 - extra,
            y + 1,
            z
        );
    }

    getTileDown(pos, y, z) {
        if (Array.isArray(pos)) {
            y = pos[1];
            z = pos[2];
        }

        const extra = y % 2 === 1 ? 1 : 0;
        if (((pos+extra) === 0 || y === 0)) return null;

        return this.getTile(
            pos - 1 + extra,
            y - 1,
            z
        );
    }

}
