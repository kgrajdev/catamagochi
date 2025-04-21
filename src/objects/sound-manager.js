// src/objects/SoundManager.js
import Storage from "../lib/storage";
import Phaser from "phaser";

export default class SoundManager {
    constructor(scene) {
        this.scene   = scene;
        this.storage = new Storage();

        // Load or default your settings
        this.gameState = this.storage.load() || { gameSettings: { isSoundEffectsOn: true } };
        this.isSoundEffectsOn = this.gameState.gameSettings.isSoundEffectsOn;

        // Prepare your sounds
        this.clickSound       = this.scene.sound.add('selectSound');
        this.clickSoundAlt    = this.scene.sound.add('selectSoundAlt');
        this.achievementSound = this.scene.sound.add('achievementSound');

        this.randomMeows = [
            this.scene.sound.add('random-bg-meow-1', { loop: false, volume: 0.5 })
        ];
    }

    /**
     * Enable or disable all sound effects at runtime.
     * Also persists the setting into localStorage.
     */
    setSoundEffectsEnabled(on) {
        this.isSoundEffectsOn = on;
        this.gameState.gameSettings.isSoundEffectsOn = on;
        this.storage.save(this.gameState);
    }

    playClickSound() {
        // Guard clause: bail immediately if effects are off
        if (!this.isSoundEffectsOn) return;
        if (!this.clickSound.isPlaying) {
            this.clickSound.play();
        }
    }

    playClickSoundAlt() {
        if (!this.isSoundEffectsOn) return;
        if (!this.clickSoundAlt.isPlaying) {
            this.clickSoundAlt.play();
        }
    }

    playAchievementSound() {
        if (!this.isSoundEffectsOn) return;
        if (!this.achievementSound.isPlaying) {
            this.achievementSound.play();
        }
    }

    playRandomMeowSound() {
        if (!this.isSoundEffectsOn) return;
        const meow = Phaser.Utils.Array.GetRandom(this.randomMeows);
        if (!meow.isPlaying) meow.play();
    }
}
