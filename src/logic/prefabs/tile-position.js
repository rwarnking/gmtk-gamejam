import * as THREE from "three";
import TileLevel from "../../core/tile-level";
import Component from "../component";
import DIRECTION from "../enums/direction";

export default class TilePosition extends Component {

    constructor(obj, x, y, z, func, duration=250) {
        super(obj, func, null, "TilePosition");
        this.isMoving = false;
        this.duration = duration;
        this.count = 1;
        this.direction = DIRECTION.NONE;
        this.position = new THREE.Vector3(0,0,0);
        this.renderOrder = TileLevel.calcRenderOrder(
            this.x, this.y, this.z
        ) - 1;
        this.setPosition(x, y, z);
        this.obj.getObject3D().position.set(
            this.position.x,
            this.position.y,
            this.position.z,
        );
        this.obj.getObject3D().renderOrder = this.renderOrder;
    }

    static create(obj, x, y, z, duration) {
        return new TilePosition(obj, x, y, z, function(obj) {
            if (this.isMoving && this.count <= this.duration) {
                obj.getObject3D().position.lerp(
                    this.position,
                    this.count++ / this.duration
                );
                this.count = this.count+1;
                if (this.count > this.duration) {
                    this.count = 1;
                    this.isMoving = false;
                    if (this.callback) {
                        this.callback();
                    }
                } else if (this.count === Math.floor(this.duration * 0.5) &&
                    (this.direction === DIRECTION.UP || this.direction === DIRECTION.LEFT)
                ) {
                    obj.getObject3D().renderOrder = this.renderOrder;
                }
            }
        }, duration);
    }

    setPosition(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        // set 3D position
        const pos = TileLevel.calculate3DPosition(x, y, z);
        this.position.x = pos[0]
        this.position.y = pos[1] + 0.175
        this.position.z = pos[2]

        if (this.isMoving && (this.direction === DIRECTION.DOWN || this.direction === DIRECTION.RIGHT)) {
            this.obj.getObject3D().renderOrder = this.renderOrder;
        }
    }

    move(direction, pos, renderOrder) {
        this.isMoving = true;
        this.direction = direction;
        this.renderOrder = renderOrder;
        if (Array.isArray(pos)) {
            this.setPosition(pos[0], pos[1], pos[2]);
        } else {
            this.setPosition(pos, y, z);
        }
    }
}
