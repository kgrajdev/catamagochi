export default class SoundManager {
    constructor(scene) {
        this.scene = scene;
        this.clickSound = this.scene.sound.add('selectSound');
        this.clickSoundAlt = this.scene.sound.add('selectSoundAlt');
        this.achievementSound = this.scene.sound.add('achievementSound');
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
    playAchievementSound = () => {
        if (!this.achievementSound.isPlaying) {
            this.achievementSound.play();
        }
    };
}