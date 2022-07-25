import Tile from "../logic/gameobjects/tile";

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
            if (!tile.isEmpty()) {
                const pos = tile.getTilePosition();
                this.setTile(
                    pos[0],
                    pos[1],
                    pos[2],
                    tile
                );
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

    setTile(x, y, z, t) {
        this.tiles[x][y][z] = t;
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
