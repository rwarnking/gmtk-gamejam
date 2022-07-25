import * as THREE from 'three';
import $ from 'cash-dom'

import { EFFECTS, SONGS, EFFECT_VOL_MOD, EFFECT_SPEED_MOD } from '../logic/enums/sounds';

export default class AudioManager {

    constructor(songVolume=0.1, effectVolume=0.25) {
        this.audiolistener = new THREE.AudioListener();
        this.loader = new THREE.AudioLoader();

        this.muted = false;
        this.songVolume = songVolume;
        this.effectVolume = effectVolume;

        this.songIndex = 0;
        this.songs = SONGS.map(() => new THREE.Audio(this.audiolistener));

        this.effects = new Map();
        Object.keys(EFFECTS).forEach(name => {
            this.effects.set(name, new THREE.Audio(this.audiolistener));
        });

        this.init();

        // try to work around the "cant play sound before interaction" restriction
        let interacted = false;
        const soundWorkaround = () => {
            if (!interacted) {
                interacted = true;
                this.playSong(0);
                $(window).off("mousemove", soundWorkaround);
                $(window).off("click", soundWorkaround);
                $(window).off("keydown", soundWorkaround);
            }
        };
        $(window).on("mousemove", soundWorkaround);
        $(window).on("click", soundWorkaround);
        $(window).on("keydown", soundWorkaround);
    }

    init() {
        SONGS.forEach((song, i) => {
            this.loader.load(song, buffer => {
                this.songs[i].setBuffer(buffer);
                this.songs[i].setLoop(true);
                this.songs[i].setVolume(this.songVolume);
            });
        })
        this.effects.forEach((effect, name) => {
            this.loader.load(EFFECTS[name], buffer => {
                effect.setBuffer(buffer);
                if (EFFECT_SPEED_MOD[name] !== undefined) {
                    effect.playbackRate = EFFECT_SPEED_MOD[name];
                }
                effect.setLoop(false);
                effect.setVolume(
                    this.effectVolume * (EFFECT_VOL_MOD[name] !== undefined ? EFFECT_VOL_MOD[name] : 1)
                );
            });
        });
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
