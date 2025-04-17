import Phaser from  'phaser';
import ColorScheme from "../lib/ColorScheme";
import Storage from "../lib/storage";

export default class SettingsScene extends Phaser.Scene {

    constructor() {
        super({key: 'SettingsScene'});
        this.colors = new ColorScheme();
        this.storage = new Storage();
    }

    preload() {
    }

    create(){
        this.gameState = this.storage.load('gameState');

        // ==== HEADING SECTION
        this.sceneHeading = this.add.text((this.game.config.width-this.game.config.width)+25, 25, 'Settings', {fontFamily: 'SuperComic', align: 'center', fontSize: '20px', color: this.colors.get('themeLight')})
            .setOrigin(0, 0.5)
        this.sceneSubHeading = this.add.text(this.sceneHeading.x, this.sceneHeading.y+this.sceneHeading.height, `Control music, manage your game save.`, {fontFamily: 'SuperComic', align: 'center', fontSize: '13px', color: this.colors.get('themeLight')})
            .setOrigin(0, 0.5)

        // ====== NAVIGATION
        this.add.text(this.game.config.width-150, this.sceneHeading.y, 'Return', {fontFamily: 'SuperComic', align: 'center', fontSize: '20px', color: this.colors.get('themeLight')}).setInteractive({useHandCursor: true})
            .on('pointerdown', () =>{
                this.scene.start('MainScene')
            })


        // ======== MUSIC TOGGLE
        const bgMusic = this.registry.get('bgMusic');
        const musicToggleTextLabel = this.add.text(this.sceneHeading.x, 100, bgMusic.isPlaying ? 'Music:' : 'Music:', {fontFamily: 'SuperComic', align: 'center', fontSize: '20px', color: this.colors.get('themeLight')})
        const musicToggleButton = this.add.text(musicToggleTextLabel.x+musicToggleTextLabel.width+20, musicToggleTextLabel.y, bgMusic.isPlaying ? 'ON' : 'OFF', {fontFamily: 'SuperComic', align: 'center', fontSize: '20px', color: this.colors.get('themeLight')}).setInteractive({useHandCursor: true})
        musicToggleButton.on('pointerdown', () => {
            if (bgMusic.isPlaying) {
                bgMusic.stop();
                musicToggleButton.setText('OFF');
                this.gameState.gameSettings.isBgMusicOn = false;
            } else {
                bgMusic.play();
                musicToggleButton.setText('ON');
                this.gameState.gameSettings.isBgMusicOn = true;
            }
            this.storage.save(this.gameState);
        });

        // ======= MUSIC VOLUME CONTROL
        let currentVolume = bgMusic.volume; // Track volume ourselves
        const volumeText = this.add.text(musicToggleTextLabel.x, musicToggleTextLabel.y+musicToggleTextLabel.height+10, `Volume: ${Math.round(bgMusic.volume * 100)}%`, {fontFamily: 'SuperComic', align: 'center', fontSize: '20px', color: this.colors.get('themeLight')});
        // Progress Bar Background
        const barX = 100;
        const barY = 180;
        const barWidth = 200;
        const barHeight = 20;
        const barBg = this.add.graphics();
        barBg.fillStyle(0x333333, 1);
        barBg.fillRect(barX, barY, barWidth, barHeight);

        // Volume Fill (dynamic)
        const barFill = this.add.graphics();

        const drawVolumeBar = (volume) => {
            const fillWidth = barWidth * volume;
            barFill.clear();
            barFill.fillStyle(0x00ff00, 1);
            barFill.fillRect(barX, barY, fillWidth, barHeight);
        };
        drawVolumeBar(bgMusic.volume);
        // Buttons
        const increaseVol = this.add.text(volumeText.x, 200, '+ Volume', {fontFamily: 'SuperComic', align: 'center', fontSize: '20px', color: this.colors.get('themeSuccess')}).setInteractive({useHandCursor: true});
        const decreaseVol = this.add.text(increaseVol.x+increaseVol.width+20, increaseVol.y, '- Volume', {fontFamily: 'SuperComic', align: 'center', fontSize: '20px', color: this.colors.get('themeError')}).setInteractive({useHandCursor: true});

        const updateVolumeUI = () => {
            bgMusic.setVolume(currentVolume);
            volumeText.setText(`Volume: ${Math.round(currentVolume * 100)}%`);
            drawVolumeBar(currentVolume);
            // also save to state
            this.gameState.gameSettings.bgMusicVolume = currentVolume;
            this.storage.save(this.gameState);
        };

        increaseVol.on('pointerdown', () => {
            if (currentVolume < 1) {
                currentVolume = Math.min(1, currentVolume + 0.1);
                updateVolumeUI();
            }
        });

        decreaseVol.on('pointerdown', () => {
            if (currentVolume > 0) {
                currentVolume = Math.max(0, currentVolume - 0.1);
                updateVolumeUI();
            }
        });
    }


}