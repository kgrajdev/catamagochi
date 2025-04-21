import Storage from "../lib/storage";
export default class SoundManager {
    constructor(scene) {
        this.scene = scene;
        this.storage = new Storage();
        this.clickSound = this.scene.sound.add('selectSound');
        this.clickSoundAlt = this.scene.sound.add('selectSoundAlt');
        this.achievementSound = this.scene.sound.add('achievementSound');
        this.gameState = this.storage.load();

        this.isSoundEffectsOn = this.gameState.gameSettings.isSoundEffectsOn;

        this.randomMeows = [
            this.scene.sound.add('random-bg-meow-1', {
                loop: false,
                volume: 0.5
            }),
            this.scene.sound.add('random-bg-meow-3', {
                loop: false,
                volume: 0.5
            }),
            this.scene.sound.add('random-bg-meow-4', {
                loop: false,
                volume: 0.5
            }),
            this.scene.sound.add('random-bg-meow-5', {
                loop: false,
                volume: 0.5
            })
        ]
    }

    playClickSound = () => {
        if (!this.clickSound.isPlaying && this.isSoundEffectsOn) {
            this.clickSound.play();
        }
    };
    playClickSoundAlt = () => {
        if (!this.clickSoundAlt.isPlaying && this.isSoundEffectsOn) {
            this.clickSoundAlt.play();
        }
    };
    playAchievementSound = () => {
        if (!this.achievementSound.isPlaying && this.isSoundEffectsOn) {
            this.achievementSound.play();
        }
    };

    playRandomMeowSound = () => {
        const randomMeowSound = Phaser.Utils.Array.GetRandom(this.randomMeows);
        if (!randomMeowSound.isPlaying && this.isSoundEffectsOn) {
            randomMeowSound.play();
        }
    }
}