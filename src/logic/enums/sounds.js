const EFFECTS = {
    ROLL: "audio/dice_1.mp3",
    BUMP: "audio/stop.wav",
    COLLECT: "audio/number_collect.mp3",
    SPLASH: "audio/splash.mp3",
    WIN: "audio/winfantasia_short.mp3",
    FAIL: "audio/nonwin.mp3",
    BUTTON: "audio/click_click.mp3",
};

const EFFECT_VOL_MOD = {
    ROLL: 0.5,
    BUTTON: 1.5,
}

const EFFECT_SPEED_MOD = {
    BUTTON: 1.5,
}

const SONGS = [
   "audio/music2.wav",
   "audio/music.wav",
];


export { SONGS, EFFECTS, EFFECT_VOL_MOD, EFFECT_SPEED_MOD };