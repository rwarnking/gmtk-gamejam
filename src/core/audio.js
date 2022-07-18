import * as THREE from 'three';

import { EFFECTS, SONGS, EFFECT_VOL_MOD } from '../logic/enums/sounds';

export default class AudioManager {

    constructor(songVolume=0.07, effectVolume=0.25) {
        this.audiolistener = new THREE.AudioListener();
        this.loader = new THREE.AudioLoader();

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
                window.removeEventListener("onmousemove", soundWorkaround);
                window.removeEventListener("onkeydown", soundWorkaround);
            }
        };
        window.addEventListener("onmousemove", soundWorkaround);
        window.addEventListener("onkeydown", soundWorkaround);
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
                effect.setLoop(false);
                effect.setVolume(
                    this.effectVolume * EFFECT_VOL_MOD[name]
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
            audio.currentTime = 0;
        }
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
            volume * EFFECT_VOL_MOD[name]
        ));
    }
}
