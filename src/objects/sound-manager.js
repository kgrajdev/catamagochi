export default class SoundManager {
    constructor(scene) {
        this.scene = scene;
        this.clickSound = this.scene.sound.add('selectSound');
        this.clickSoundAlt = this.scene.sound.add('selectSoundAlt');
    }

    playClickSound = () => {
        if (!this.clickSound.isPlaying) {
            this.clickSound.play();
        }
    };
    playClickSoundAlt = () => {
        if (!this.clickSoundAlt.isPlaying) {
            this.clickSoundAlt.play();
        }
    };
}