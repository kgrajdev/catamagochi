import Phaser from  'phaser';
import {CatAnimations} from "../lib/cat-animations";
import {
    DEFAULT_STATS,
    MAX_STATS,
    AP_COSTS,
    DECAY_RATES,
    COLOR_THRESHOLDS,
    PLAYER_CONFIG,
    DECOR_CATALOG
} from "../lib/default-properties";
import ColorScheme from "../lib/ColorScheme";

export default class BootScene extends Phaser.Scene {

    constructor() {
        super({key: 'BootScene'});
        this.colors = new ColorScheme();
    }

    preload() {
        this.load.font('SuperComic', 'assets/font/SuperComic.ttf');

        // Load all decor images
        Object.entries(DECOR_CATALOG).forEach(([category, items]) => {
            items.forEach(item => {
                const key = item.id; // e.g. "bed1"
                const path = `assets/room-decor/${category}/${item.id}.png`; // e.g. "assets/decor/bed/bed1.png"
                this.load.image(key, path);
            });
        });

        this.load.image('coin', 'assets/ui/coin.png');
        this.load.image('decor-holder', 'assets/room-decor/bed/bed0.png');

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
        this.startButton = this.add.text(this.game.config.width/2, this.game.config.height/2, '', {fontFamily: 'SuperComic', align: 'center', fontSize: '35px', color: this.colors.get('themeLight')})
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