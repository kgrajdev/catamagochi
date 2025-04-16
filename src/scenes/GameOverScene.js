import Phaser from  'phaser';

export default class GameOverScene extends Phaser.Scene {

    constructor() {
        super({key: 'GameOverScene'});
    }

    preload() {
    }

    create(){
        this.gameOverText = this.add.text(this.game.config.width/2, this.game.config.height/2, 'The Cat has died....', {fontSize: '25px', color: '#ff1111'})
            .setOrigin(0.5)
    }


}