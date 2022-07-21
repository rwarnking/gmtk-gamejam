import TextureCycle from "../components/texture-cycle";
import UIElement from "../ui-element";

function createButton(x, y, textures, func) {

    const isArray = Array.isArray(textures);
    const tex = isArray ? textures[0] : textures;
    const button = new UIElement(x, y, tex, true);
    const picking = button.getPicking();
    picking.setClickFunc(func);

    // if we have a button with a "down" texture, add a texture cycler
    if (isArray) {
        button.addComponent(TextureCycle.createToggle(button, textures, 150));
    }

    return button;
}

function createNextLevelButton(x, y, textures) {

    const tex = Array.isArray(textures) ? textures[0] : textures;
    const button = new UIElement(x, y, tex, true);
    const picking = button.getPicking();
    picking.setClickFunc(func);

    // if we have a button with a "down" texture, add a texture cycler
    if (isArray) {
        button.addComponent(TextureCycle.createToggle(button, textures, 150));
    }

    return button;
}

export { createButton as default, createNextLevelButton };