import * as THREE from 'three';

export default class AudioListener {


    constructor() {
        this.audiolistener = new THREE.AudioListener();
        this.sound = new THREE.Audio(this.audiolistener);
        this.loader = new THREE.AudioLoader();
        this.songnum = 1;
        this.volume = 0.4;
        this.songs =  ['/audio/music2.wav','/audio/music.wav','/audio/music2.wav']
        this.init();
    };

    init() {
        this.loader.load(this.songs[this.songnum], buffer => {
            this.sound.setBuffer(buffer);
            this.sound.setLoop(true)
            this.sound.setVolume(this.volume);
            this.sound.play();
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
        this.init();
    }



}
