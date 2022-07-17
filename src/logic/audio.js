import * as THREE from 'three';

// const PEFIX = "dist/";

export default class AudioListener {

    constructor() {
        this.audiolistener = new THREE.AudioListener();
        this.sound = new THREE.Audio(this.audiolistener);
        this.loader = new THREE.AudioLoader();
        this.songnum = 0;
        this.volume = 0.05;
        this.songs =  ['audio/music2.wav','audio/music.wav','audio/music2.wav']
        this.bumpsound = new THREE.Audio(this.audiolistener);
        this.rollsound = new THREE.Audio(this.audiolistener);
        this.winsound = new THREE.Audio(this.audiolistener);
        this.collectsound = new THREE.Audio(this.audiolistener);
        this.nonwinsound = new THREE.Audio(this.audiolistener);
        this.effectsoundvolume = 0.25;
        this.init();

    }

    init() {
        this.loader.load(this.songs[this.songnum], buffer => {
            this.sound.setBuffer(buffer);
            this.sound.setLoop(true);
            this.sound.setVolume(this.volume);
            this.sound.play();
        });

        this.loader2 = new THREE.AudioLoader();
        this.loader2.load('audio/stop.wav', buffer => {
            this.bumpsound.setBuffer(buffer);
            this.bumpsound.setLoop(false);
            this.bumpsound.setVolume(this.effectsoundvolume);
        });

        this.loader3 = new THREE.AudioLoader();
        let dicevol;
        this.loader3.load('audio/dice_1.mp3', buffer => {
            this.rollsound.setBuffer(buffer);
            this.rollsound.setLoop(false);
            if(this.effectsoundvolume>0){
                dicevol = this.effectsoundvolume/2;
            }else{
                dicevol =  this.effectsoundvolume;
            }
            this.rollsound.setVolume(dicevol);
        });

        this.loader4 = new THREE.AudioLoader();
        this.loader4.load('audio/winfantasia_short.mp3', buffer => {
            this.winsound.setBuffer(buffer);
            this.winsound.setLoop(false);
            this.winsound.setVolume(this.effectsoundvolume);
        });

        this.loader5 = new THREE.AudioLoader();
        this.loader5.load('audio/number_collect.mp3', buffer => {
            this.collectsound.setBuffer(buffer);
            this.collectsound.setLoop(false);
            this.collectsound.setVolume(this.effectsoundvolume);
        });

        this.loader6 = new THREE.AudioLoader();
        this.loader6.load('audio/nonwin.mp3', buffer => {
            this.nonwinsound.setBuffer(buffer);
            this.nonwinsound.setLoop(false);
            this.nonwinsound.setVolume(this.effectsoundvolume);
        });



    }

    getsound() {
        return this.sound;
    }

    changesound() {
        this.songnum++;
        if (this.songnum > this.songs.length){
            console.log("All songs have been played")
            this.songnum = 0;
        }
        this.init();
    }

    changevolume(newvolume){
        this.volume = newvolume;
        this.sound.setVolume(this.volume);
    }

    changeeffectvolume(newvolume){ // put 0 to turn off
        this.effectsoundvolume = newvolume;
        this.init();
        // alternatively call all vars and change their volume individualy
    }

    playbump() {
        this.bumpsound.play();
    }

    playroll() {
        this.rollsound.play();
    }

    playwin() {
        this.winsound.play();
    }

    playcollect() {
        this.collectsound.play();
    }

    playnowin(){
        this.nonwinsound.play();
    }

}
