export default class SoundManager {
    constructor(scene) {
        this.scene = scene;
        this.clickSound = this.scene.sound.add('selectSound');
    }

    playClickSound = () => {
        if (!this.clickSound.isPlaying) {
            this.clickSound.play();
        }
    };
}