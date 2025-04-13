import Phaser from  'phaser';

export default class AchievementsScene extends Phaser.Scene {

    constructor() {
        super({key: 'AchievementsScene'});
    }

    preload() {
    }

    create(){
        this.sceneHeading = this.add.text(this.game.config.width/2, 200, 'Achievements', {fontSize: '25px', color: '#ff1111'})
            .setOrigin(0.5)
        // ====== NAVIGATION
        this.add.text(100, 100, 'Back').setInteractive({useHandCursor: true})
            .on('pointerdown', () =>{
                this.scene.start('MainScene')
            })
    }


}