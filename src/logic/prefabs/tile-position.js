import TileLevel from "../../core/tile-level";
import Component from "../component";

export default class TilePosition extends Component {

    constructor(obj, x, y, z, func) {
        super(obj, func, "TilePosition");
        this.isMoving = false;
        this.setPosition(x, y, z);
    }

    static create(obj, x, y, z) {
        return new TilePosition(obj, x, y, z, function() {});
    }

    setPosition(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.position = TileLevel.calculate3DPosition(x, y, z);
        // set 3D position
        this.obj.getObject3D().position.set(
            this.position[0],
            this.position[1]+0.175,
            this.position[2]
        );
        this.obj.getObject3D().renderOrder = TileLevel.calcRenderOrder(x, y, z)+1
        ;
    }

    // TODO: !!!!
    move(pos, y, z) {
        this.isMoving = true;
        if (Array.isArray(pos)) {
            this.setPosition(pos[0], pos[1], pos[2]);
        } else {
            this.setPosition(pos, y, z);
        }
        setTimeout(() => this.isMoving = false, 200);
    }
}
