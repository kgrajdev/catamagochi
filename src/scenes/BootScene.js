import Phaser from  'phaser';
import {CatAnimations} from "../lib/cat-animations";
export default class BootScene extends Phaser.Scene {

    constructor() {
        super({key: 'BootScene'});
    }

    preload() {
        this.load.image('room', 'assets/Room2.png');

        this.load.spritesheet('cat-tiles-master', 'assets/AllCatsBlack.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('cat-toy-sprite', 'assets/CatToy.png', { frameWidth: 32, frameHeight: 32 });
        this.load.image('cat-medicine', 'assets/cat-medicine.png');
        this.load.image('litter-tray-clean', 'assets/CatLitterTray.png');
        this.load.image('litter-tray-dirty', 'assets/CatLitterTrayDirty.png');
        this.load.image('bowl-food-full', 'assets/bowl-food-full.png');
        this.load.image('bowl-water-full', 'assets/bowl-water-full.png');
        this.load.image('bowl-empty', 'assets/bowl-empty.png');

    }

    create(){
        this.catAnimations = new CatAnimations(this);
        this.startButton = this.add.text(this.game.config.width/2, this.game.config.height/2, '', {fontSize: '25px', color: '#ff1111'})
            .setOrigin(0.5)
            .setInteractive({useHandCursor: true})
            .setDepth(1000)
            .on('pointerdown', () => {
                this.scene.start('MainScene')
            });

        // check for save data
        this.checkForSaveData(this.startButton);
    }

    checkForSaveData(startButton) {
        try {
            const saved = localStorage.getItem('catamagochi_game_state');
            if (saved) {
                startButton.setText('Resume')
            } else {
                startButton.setText('Start New Game')
            }
        } catch (e) {
            console.error('Error loading game data:', e);
        }
    }
}