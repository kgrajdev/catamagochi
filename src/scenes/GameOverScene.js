import Phaser from  'phaser';
import SoundManager from "../objects/sound-manager";
import Storage from "../lib/storage";
import ColorScheme from "../lib/ColorScheme";
export default class GameOverScene extends Phaser.Scene {

    constructor() {
        super({key: 'GameOverScene'});
        this.storage = new Storage();
        this.colors = new ColorScheme();
    }

    preload() {
    }

    create(){
        this.add.image(this.game.config.width/2, this.game.config.height/2, 'bgImage2').setDepth(1)
        this.soundManager = new SoundManager(this);

        // ==== HEADING SECTION
        this.sceneHeading = this.add.text((this.game.config.width-this.game.config.width)+25, 25, 'Game Over', {fontFamily: 'SuperComic', align: 'center', fontSize: '20px', color: this.colors.get('themePrimaryDark')})
            .setOrigin(0, 0.5).setDepth(2)

        // ====== NAVIGATION
        this.returnButton = this.add.text(this.game.config.width-150, this.sceneHeading.y, 'Return', {fontFamily: 'SuperComic', align: 'center', fontSize: '20px', color: this.colors.get('themePrimaryDark')}).setInteractive({useHandCursor: true}).setDepth(2)
            .on('pointerdown', () => {
                this.storage.hardReset();
                this.soundManager.playClickSound();
                this.scene.start('BootScene')
            }).on('pointerover', () => {
                this.returnButton.setStyle({
                    color: this.colors.get('themePrimaryLight')
                })
            }).on('pointerout', () => {
                this.returnButton.setStyle({
                    color: this.colors.get('themePrimaryDark')
                })
            })

        this.gameOverText = this.add.text(this.game.config.width/2, this.game.config.height/2.2, 'The Cat has died....', {
            fontFamily: 'SuperComic',
            align: 'center',
            fontSize: '22px',
            color: this.colors.get('themeError')
        })
            .setOrigin(0.5)
            .setDepth(2)
    }


}