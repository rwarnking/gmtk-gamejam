import * as THREE from 'three';

import { EFFECTS, SONGS, EFFECT_VOL_MOD, EFFECT_SPEED_MOD } from '../logic/enums/sounds';

export default class AudioManager {

    constructor(songVolume=0.1, effectVolume=0.25) {
        this.muted = false;
        this.songVolume = songVolume;
        this.effectVolume = effectVolume;
        this.songIndex = 0;
    }

    async init() {
        this.audiolistener = new THREE.AudioListener();
        this.loader = new THREE.AudioLoader();
        this.songs = SONGS.map(() => new THREE.Audio(this.audiolistener));
        this.effects = new Map();
        Object.keys(EFFECTS).forEach(name => {
            this.effects.set(name, new THREE.Audio(this.audiolistener));
        });

        const proms = SONGS.map((song, i) => {
            return this.loader.loadAsync(song)
                .then(buffer => {
                    this.songs[i].setBuffer(buffer);
                    this.songs[i].setLoop(true);
                    this.songs[i].setVolume(this.songVolume);
                });
        })
        this.effects.forEach((effect, name) => {
            proms.push(this.loader.loadAsync(EFFECTS[name])
                .then(buffer => {
                    effect.setBuffer(buffer);
                    if (EFFECT_SPEED_MOD[name] !== undefined) {
                        effect.playbackRate = EFFECT_SPEED_MOD[name];
                    }
                    effect.setLoop(false);
                    effect.setVolume(
                        this.effectVolume * (EFFECT_VOL_MOD[name] !== undefined ? EFFECT_VOL_MOD[name] : 1)
                    );
                })
            );
        });

        return Promise.all(proms).then(() => this.playSong(0));
    }

    getSong() {
        return this.songs[this.songIndex];
    }

    /**
     *
     * @param {THREE.Audio} audio
     */
    play(audio) {
        if (audio.isPlaying) {
            audio.stop();
        }
        audio.currentTime = 0;
        audio.play();
        console.log(audio)
    }

    playSong(index) {
        this.songIndex = index % this.songs.length;
        this.play(this.getSong());
    }

    playEffect(name) {
        const effect = this.effects.get(name);
        if (effect) {
            this.play(effect);
        }
    }

    nextSong() {
        this.playSong(this.songIndex + 1);
    }

    setSongVolume(volume) {
        this.songVolume = volume;
        this.songs.forEach(song => song.setVolume(volume));
    }

    setEffectVolume(volume) {
        this.effectVolume = volume;
        this.effects.forEach((effect, name) => effect.setVolume(
            volume * (EFFECT_VOL_MOD[name] !== undefined ? EFFECT_VOL_MOD[name] : 1)
        ));
    }

    toggleMute() {
        const volume = this.muted ? this.songVolume : 0;
        this.songs.forEach(song => song.setVolume(volume));
        this.effects.forEach(effect => effect.setVolume(volume));
        this.muted = !this.muted;
    }

}
