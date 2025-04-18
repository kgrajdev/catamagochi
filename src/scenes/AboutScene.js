import Phaser from  'phaser';
import ColorScheme from "../lib/ColorScheme";
import SoundManager from "../objects/sound-manager";

export default class AboutScene extends Phaser.Scene {

    constructor() {
        super({key: 'AboutScene'});
        this.colors = new ColorScheme();
    }

    preload() {
    }

    create(){
        this.add.image(this.game.config.width/2, this.game.config.height/2, 'bgImage').setDepth(1)
        this.soundManager = new SoundManager(this);

        // ==== HEADING SECTION
        this.sceneHeading = this.add.text((this.game.config.width-this.game.config.width)+25, 25, 'About & Credits', {fontFamily: 'SuperComic', align: 'center', fontSize: '20px', color: this.colors.get('themePrimaryDark')})
            .setOrigin(0, 0.5).setDepth(2)

        // ====== NAVIGATION
        this.returnButton = this.add.text(this.game.config.width-150, this.sceneHeading.y, 'Return', {fontFamily: 'SuperComic', align: 'center', fontSize: '20px', color: this.colors.get('themePrimaryDark')}).setInteractive({useHandCursor: true}).setDepth(2)
            .on('pointerdown', () => {
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

        this.aboutText = this.add.text(this.game.config.width/2, this.game.config.height/2.9, 'Lorem Ipsum Dolor Sit Amet,\nImpis et Enes Revo.\nTero Fed Ager.', {fontFamily: 'SuperComic', align: 'left', fontSize: '20px', color: this.colors.get('themePrimaryDark')}).setDepth(2).setOrigin(0.5)
        this.creditsText = this.add.text(this.game.config.width/2, this.game.config.height/1.7, 'Lorem Ipsum Dolor Sit Amet,\nImpis et Enes Revo.\nTero Fed Ager.', {fontFamily: 'SuperComic', align: 'left', fontSize: '20px', color: this.colors.get('themePrimaryDark')}).setDepth(2).setOrigin(0.5)
    }


}