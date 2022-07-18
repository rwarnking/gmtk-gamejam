import GameObject from "../gameobject";
import TextureCycle from "./texture-cycle";
import TAGS from "../enums/tags";

export default function createBackground() {

    const obj = new GameObject();
    obj.addTag(TAGS.BACKGROUND);
    obj.addComponent(TextureCycle.createCycle(
        obj,
        [
            // "assets/background/sky-simple.png",
            "assets/background/1.png",
            "assets/background/2.png",
            "assets/background/3.png",
            "assets/background/4.png",
            "assets/background/5.png",
            "assets/background/6.png",
            "assets/background/7.png",
            "assets/background/8.png",
        ],
        10000 * 8,
        false,
    ));

    return obj;
}