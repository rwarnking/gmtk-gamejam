import * as THREE from "three";
import TileLevel from "../../core/tile-level";
import Component from "../component";
import DIRECTION from "../enums/direction";

export default class TilePosition extends Component {

    constructor(obj, x, y, z, func, duration=250) {
        super(obj, func, null, "TilePosition");
        this.isMoving = false;
        this.duration = duration; // in ms
        this.count = 1;
        this.direction = DIRECTION.NONE;
        this.position = new THREE.Vector3(0,0,0);
        this.renderOrder = TileLevel.calcRenderOrderPlayer(this.x, this.y, this.z);
        this.setPosition(x, y, z);
        this.obj.getObject3D().position.set(
            this.position.x,
            this.position.y,
            this.position.z,
        );
        this.obj.getObject3D().renderOrder = this.renderOrder;
    }

    static create(obj, x, y, z, duration) {
        return new TilePosition(obj, x, y, z, function(obj, delta) {
            if (this.isMoving) {

                if (this.last === undefined) {
                    this.last = Date.now();
                }

                const now = Date.now();
                const d = now - this.last;
                const obj3d = obj.getObject3D();

                if (d <= this.duration) {
                    const frac = d / this.duration;
                    obj3d.position.lerp(
                        this.position,
                        frac
                    );
                    if (+frac.toFixed(1) === 0.5 &&
                        (this.direction === DIRECTION.LEFT || this.direction === DIRECTION.UP)
                    ) {
                        obj3d.renderOrder = this.renderOrder;
                        obj3d.children.forEach(c => c.renderOrder = this.renderOrder);
                    }
                } else {
                    this.last = undefined;
                    this.isMoving = false;
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

        if (this.direction === DIRECTION.RIGHT || this.direction === DIRECTION.DOWN) {
            this.obj.getObject3D().renderOrder = this.renderOrder;
            this.obj.getObject3D().children.forEach(c => c.renderOrder = this.renderOrder);
        }
    }

    move(direction, pos) {
        this.isMoving = true;
        this.direction = direction;
        this.renderOrder = TileLevel.calcRenderOrderPlayer(pos[0], pos[1], pos[2]);
        this.setPosition(pos[0], pos[1], pos[2]);
    }
}
