import 'phaser';
import GameScene from "./scenes/MainScene";
import BootScene from "./scenes/BootScene";

let config = {
    type: Phaser.AUTO,
    width: 960,
    height: 600,
    backgroundColor: "#4a4a4a",
    dom: {
        createContainer: true
    },
    parent: "game-container",
    scene: [BootScene, GameScene],
    pixelArt: true
};

const game = new Phaser.Game(config);