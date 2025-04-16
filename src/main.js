import 'phaser';
import MainScene from "./scenes/MainScene";
import BootScene from "./scenes/BootScene";
import GameOverScene from "./scenes/GameOverScene";
import StoreScene from "./scenes/StoreScene";
import AchievementsScene from "./scenes/AchievementsScene";
import SettingsScene from "./scenes/SettingsScene";

let config = {
    type: Phaser.AUTO,
    width: 960,
    height: 600,
    backgroundColor: "#4a4a4a",
    dom: {
        createContainer: true
    },
    parent: "game-container",
    scene: [BootScene, MainScene, GameOverScene, StoreScene, AchievementsScene, SettingsScene],
    pixelArt: true
};

const game = new Phaser.Game(config);