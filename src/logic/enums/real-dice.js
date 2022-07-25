const REAL_DICE = Object.freeze({
    0: 6,
    1: 3,
    2: 1,
    3: 4,
    4: 5,
    5: 2,
});

const DICE_POS =  Object.freeze({
    TOP: 2,
    LEFT: 1,
    RIGHT: 5,
    BACK_RIGHT: 3,
    BACK_LEFT: 4,
    BOTTOM: 0
});

const DICE_POS_OPP =  Object.freeze({
    TOP: DICE_POS.BOTTOM,
    LEFT: DICE_POS.BACK_RIGHT,
    RIGHT: DICE_POS.BACK_LEFT,
    BACK_RIGHT: DICE_POS.LEFT,
    BACK_LEFT: DICE_POS.RIGHT,
    BOTTOM: DICE_POS.TOP,
});

const DICE_MOVE_H = [
    DICE_POS.BOTTOM, DICE_POS.LEFT,
    DICE_POS.TOP, DICE_POS.BACK_RIGHT,
];
const DICE_MOVE_V = [
    DICE_POS.BOTTOM, DICE_POS.BACK_LEFT,
    DICE_POS.TOP, DICE_POS.RIGHT,
];

function decrement(array, pos) {
    return array[pos == 0 ? array.length-1 : pos-1];
}

function increment(array, pos) {
    return array[pos == array.length-1 ? 0 : pos+1]
}

export {
    REAL_DICE as default,
    DICE_POS,
    DICE_POS_OPP,
    DICE_MOVE_H,
    DICE_MOVE_V,
    decrement,
    increment,
};