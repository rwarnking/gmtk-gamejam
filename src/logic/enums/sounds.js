const EFFECTS = {
    ROLL: "audio/dice_1.mp3",
    BUMP: "audio/stop.wav",
    COLLECT: "audio/number_collect.mp3",
    SPLASH: "audio/splash.mp3",
    WIN: "audio/winfantasia_short.mp3",
    FAIL: "audio/nonwin.mp3",
};

const EFFECT_VOL_MOD = {
    ROLL: 0.5,
    BUMP: 1,
    COLLECT: 1,
    SPLASH: 1,
    WIN: 1,
    FAIL: 1
}

const SONGS = [
   "audio/music2.wav",
   "audio/music.wav",
];


export { SONGS, EFFECTS, EFFECT_VOL_MOD };