
export default class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });

    }

    create() {
        // ====== NAVIGATION
        this.add.text(100, 100, 'Store').setInteractive({useHandCursor: true})
            .on('pointerdown', () =>{
                this.scene.start('StoreScene')
            })
        this.add.text(200, 100, 'Achievements').setInteractive({useHandCursor: true})
            .on('pointerdown', () =>{
                this.scene.start('AchievementsScene')
            })
        this.add.text(400, 100, 'Settings').setInteractive({useHandCursor: true})
            .on('pointerdown', () =>{
                this.scene.start('SettingsScene')
            })


        // Create the cat sprite and set default position and animation.
        this.catCharacter = this.add.sprite(350, 350, 'cat-tiles-master').setScale(1.1);
        this.catCharacter.play('idle');



    }



    update() {

    }


}
