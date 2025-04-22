import Phaser from  'phaser';
import {CatAnimations} from "../lib/cat-animations";
import {
    DEFAULT_STATS,
    MAX_STATS,
    AP_COSTS,
    DECAY_RATES,
    PLAYER_CONFIG,
    DECOR_CATALOG, RANDOM_IDLE_BEHAVIORS
} from "../lib/default-properties";
import ColorScheme from "../lib/ColorScheme";
import SoundManager from "../objects/sound-manager";
import Storage from "../lib/storage";

export default class BootScene extends Phaser.Scene {

    constructor() {
        super({key: 'BootScene'});
        this.colors = new ColorScheme();
        this.storage = new Storage();
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

        // Load all cat sprite-sheets
        Object.entries(DECOR_CATALOG.cat).forEach(item => {
            this.load.spritesheet(`cat-tiles-${item[1].id}`, `assets/room-decor/cat/${item[1].id}.png`, { frameWidth: 64, frameHeight: 64 });
        });

        this.load.image('coin', 'assets/ui/coin.png');
        this.load.image('decor-holder', 'assets/room-decor/bed/bed0.png');

        this.load.image('cat-medicine', 'assets/cat-medicine.png');

        this.load.spritesheet('cat-toy-sprite', 'assets/CatToy.png', { frameWidth: 32, frameHeight: 32 });
        this.load.image('litter-tray-clean', 'assets/CatLitterTray.png');
        this.load.image('litter-tray-dirty', 'assets/CatLitterTrayDirty.png');
        this.load.image('bowl-food-full', 'assets/bowl-food-full.png');
        this.load.image('bowl-water-full', 'assets/bowl-water-full.png');
        this.load.image('bowl-empty', 'assets/bowl-empty.png');

        this.load.audio('bgMusic', 'assets/music/Retro-Beat.ogg');
        this.load.audio('selectSound', 'assets/music/select_001.ogg');
        this.load.audio('selectSoundAlt', 'assets/music/select_003.ogg');
        this.load.audio('achievementSound', 'assets/music/confirmation_002.ogg');

        this.load.image('bgImage', 'assets/game-bg.png');
        this.load.image('bgImage2', 'assets/game-bg-2.png');
        this.load.image('bgBuildingImage', 'assets/building-bg.png');

        this.load.audio('random-bg-meow-1', 'assets/music/meowlo-1.mp3');
        this.load.audio('random-bg-meow-3', 'assets/music/meowlo-3.mp3');
        this.load.audio('random-bg-meow-4', 'assets/music/meowlo-4.mp3');
        this.load.audio('random-bg-meow-5', 'assets/music/meowlo-5.mp3');
    }

    create(){
        this.soundManager = new SoundManager(this);

        this.add.image(this.game.config.width/2, this.game.config.height/2, 'bgImage').setDepth(1);

        this.add.text(this.game.config.width/2, this.game.config.height/2-100, 'Catamagochi', {fontFamily: 'SuperComic', align: 'center', fontSize: '35px', color: this.colors.get('themePrimary')})
            .setOrigin(0.5)
            .setDepth(1000)

        this.startButton = this.add.text(this.game.config.width/2, this.game.config.height/2, '', {fontFamily: 'SuperComic', align: 'center', fontSize: '35px', color: this.colors.get('themePrimaryDark')})
            .setOrigin(0.5)
            .setInteractive({useHandCursor: true})
            .setDepth(1000)
            .on('pointerdown', () => {
                this.soundManager.playRandomMeowSound();
                this.scene.start('MainScene')
            })
            .on('pointerover', () => {
                this.startButton.setStyle({
                    color: this.colors.get('themePrimaryLight')
                })
            }).on('pointerout', () => {
                this.startButton.setStyle({
                    color: this.colors.get('themePrimaryDark')
                })
            });

        // check for save data
        this.checkForSaveData(this.startButton);
        this.catAnimations = new CatAnimations(this);
        this.addBootCat(this.storage.load())
    }

    checkForSaveData(startButton) {
        try {
            if (this.storage.load()) {
                startButton.setText('Resume')
            } else {
                startButton.setText('Start New Game')
            }
        } catch (e) {
            console.error('Error loading game data:', e);
        }
    }

    addBootCat(isNewGame) {

        this.catCharacter = this.add.sprite(this.game.config.width-this.game.config.width-50, this.game.config.height/1.25, 'cat-tiles-AllCatsBlack').setScale(1.1).setDepth(1001);
        this.catCharacter.play('running-AllCatsBlack');

        if (isNewGame) {
            const distance = Math.hypot(this.game.config.width-this.game.config.width-50, this.game.config.width/2);
            const speed = 100; // px/sec
            const duration = (distance / speed) * 750;
            this.tweens.add({
                targets: this.catCharacter,
                x: this.game.config.width/2,
                y: this.game.config.height/1.25,
                duration,
                ease: 'Linear',
                onComplete: () => {
                    this.catCharacter.play('sleeping-AllCatsBlack')
                }
            });
        } else {
            const distance = Math.hypot(this.game.config.width-this.game.config.width-50, this.game.config.width+50);
            const speed = 100; // px/sec
            const duration = (distance / speed) * 750;
            this.tweens.add({
                targets: this.catCharacter,
                x: this.game.config.width+50,
                y: this.game.config.height/1.25,
                duration,
                ease: 'Linear',
                onComplete: () => {
                    this.catCharacter.setVisible(false)
                }
            });
        }

    }
}