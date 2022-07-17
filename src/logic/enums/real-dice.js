const REAL_DICE = Object.freeze({
    0: 6,
    1: 3,
    2: 5,
    3: 1,
    4: 2,
    5: 4,
})

const REAL_DICE_REVERSE = {};
Object.entries(REAL_DICE).forEach(([k, v]) => {
    REAL_DICE_REVERSE[v] = k;
});

// left - right - top - bttom
const NEIGHBORS = {
    1: [3, 4, 5, 2],
    2: [3, 4, 6, 1],
    3: [6, 1, 5, 2],
    4: [1, 6, 5, 2],
    5: [3, 4, 2, 1],
    6: [4, 3, 5, 2],
};

export { REAL_DICE as default, REAL_DICE_REVERSE, NEIGHBORS };