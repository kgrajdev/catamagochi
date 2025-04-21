import Phaser from  'phaser';
import ColorScheme from "../lib/ColorScheme";
import Storage from "../lib/storage";
import SoundManager from "../objects/sound-manager";
import SaveExportImport from "../lib/SaveExportImport";

export default class SettingsScene extends Phaser.Scene {

    constructor() {
        super({key: 'SettingsScene'});
        this.colors = new ColorScheme();
        this.storage = new Storage();
    }

    preload() {
    }

    create(){
        this.add.image(this.game.config.width/2, this.game.config.height/2, 'bgImage').setDepth(1)
        this.soundManager = new SoundManager(this);

        // Create an instance of SaveExportImport.
        this.saveExportImport = new SaveExportImport(this);

        this.gameState = this.storage.load();

        // ==== HEADING SECTION
        this.sceneHeading = this.add.text((this.game.config.width-this.game.config.width)+25, 25, 'Settings', {fontFamily: 'SuperComic', align: 'center', fontSize: '20px', color: this.colors.get('themePrimaryDark')})
            .setOrigin(0, 0.5).setDepth(2)
        this.sceneSubHeading = this.add.text(this.sceneHeading.x, this.sceneHeading.y+this.sceneHeading.height, `Control music, manage your game save.`, {fontFamily: 'SuperComic', align: 'center', fontSize: '13px', color: this.colors.get('themePrimaryDark')})
            .setOrigin(0, 0.5).setDepth(2)

        // ====== NAVIGATION
        this.returnButton = this.add.text(this.game.config.width-150, this.sceneHeading.y, 'Return', {fontFamily: 'SuperComic', align: 'center', fontSize: '20px', color: this.colors.get('themePrimaryDark')}).setInteractive({useHandCursor: true}).setDepth(2)
        .on('pointerdown', () => {
            this.soundManager.playClickSound();
            this.scene.start('MainScene')
        }).on('pointerover', () => {
                this.returnButton.setStyle({
                    color: this.colors.get('themePrimaryLight')
                })
        }).on('pointerout', () => {
                this.returnButton.setStyle({
                    color: this.colors.get('themePrimaryDark')
                })
        })


        // ======== MUSIC TOGGLE
        const bgMusic = this.registry.get('bgMusic');
        const musicToggleTextLabel = this.add.text(this.sceneHeading.x, 100, 'Music:', {fontFamily: 'SuperComic', align: 'center', fontSize: '20px', color: this.colors.get('themePrimaryDark')}).setDepth(2)
        const musicToggleButton = this.add.text(musicToggleTextLabel.x+musicToggleTextLabel.width+20, musicToggleTextLabel.y, bgMusic.isPlaying ? 'ON' : 'OFF', {fontFamily: 'SuperComic', align: 'center', fontSize: '20px', color: this.colors.get(bgMusic.isPlaying ? 'themeSuccess' : 'themeError')}).setInteractive({useHandCursor: true}).setDepth(2)
        musicToggleButton.on('pointerdown', () => {
            this.soundManager.playClickSound();
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
        musicToggleButton.on('pointerover', () => {
            musicToggleButton.setStyle({
                color: this.colors.get('themePrimaryLight')
            })
        })
            musicToggleButton.on('pointerout', () => {
            musicToggleButton.setStyle({
                color: this.colors.get('themePrimaryDark')
            })
        })

        // ======= MUSIC VOLUME CONTROL
        let currentVolume = bgMusic.volume; // Track volume ourselves
        const volumeText = this.add.text(musicToggleTextLabel.x, musicToggleTextLabel.y+musicToggleTextLabel.height+10, `Volume: ${Math.round(bgMusic.volume * 100)}%`, {fontFamily: 'SuperComic', align: 'center', fontSize: '20px', color: this.colors.get('themePrimaryDark')}).setDepth(2)
        // Progress Bar Background
        const barX = volumeText.x;
        const barY = volumeText.y+volumeText.height+10;
        const barWidth = 200;
        const barHeight = 20;
        const barBg = this.add.graphics().setDepth(2);
        barBg.fillStyle(this.colors.getHex('themePrimaryDark'), 1); // background of the bar
        barBg.fillRect(barX, barY, barWidth, barHeight);

        // Volume Fill (dynamic)
        const barFill = this.add.graphics().setDepth(2);

        const drawVolumeBar = (volume) => {
            const fillWidth = barWidth * volume;
            barFill.clear();
            barFill.fillStyle(this.colors.getHex('themePrimaryLight'), 1); // actual movable bar
            barFill.fillRect(barX+1, barY+1, fillWidth-2, barHeight-2);
        };
        drawVolumeBar(bgMusic.volume);
        // Buttons
        const increaseVol = this.add.text(volumeText.x, 200, '+Volume', {fontFamily: 'SuperComic', align: 'center', fontSize: '20px', color: this.colors.get('themeSuccess')}).setInteractive({useHandCursor: true}).setDepth(2);
        const decreaseVol = this.add.text(increaseVol.x+increaseVol.width+20, increaseVol.y, '-Volume', {fontFamily: 'SuperComic', align: 'center', fontSize: '20px', color: this.colors.get('themeError')}).setInteractive({useHandCursor: true}).setDepth(2);

        const updateVolumeUI = () => {
            bgMusic.setVolume(currentVolume);
            volumeText.setText(`Volume: ${Math.round(currentVolume * 100)}%`);
            drawVolumeBar(currentVolume);
            // also save to state
            this.gameState.gameSettings.bgMusicVolume = currentVolume;
            this.storage.save(this.gameState);
        };

        increaseVol.on('pointerdown', () => {
            this.soundManager.playClickSound();
            if (currentVolume < 1) {
                currentVolume = Math.min(1, currentVolume + 0.1);
                updateVolumeUI();
            }
        });
        increaseVol.on('pointerover', () => {
            increaseVol.setStyle({
                color: this.colors.get('themeSuccessDark')
            })
        }).on('pointerout', () => {
            increaseVol.setStyle({
                color: this.colors.get('themeSuccess')
            })
        });

        decreaseVol.on('pointerdown', () => {
            this.soundManager.playClickSound();
            if (currentVolume > 0) {
                currentVolume = Math.max(0, currentVolume - 0.1);
                updateVolumeUI();
            }
        });
        decreaseVol.on('pointerover', () => {
            decreaseVol.setStyle({
                color: this.colors.get('themeErrorDark')
            })
        }).on('pointerout', () => {
            decreaseVol.setStyle({
                color: this.colors.get('themeError')
            })
        });

        // ====== SOUND EFFECTS TOGGLE
        const isSoundEffectsOn = this.gameState.gameSettings.isSoundEffectsOn;
        const soundEffectsToggleTextLabel = this.add.text(this.sceneHeading.x, 250, 'Sound Effects:', {fontFamily: 'SuperComic', align: 'center', fontSize: '20px', color: this.colors.get('themePrimaryDark')}).setDepth(2)
        const soundEffectsToggleButton = this.add.text(soundEffectsToggleTextLabel.x+soundEffectsToggleTextLabel.width+20, soundEffectsToggleTextLabel.y, isSoundEffectsOn ? 'ON' : 'OFF', {fontFamily: 'SuperComic', align: 'center', fontSize: '20px', color: this.colors.get(isSoundEffectsOn ? 'themeSuccess' : 'themeError')}).setInteractive({useHandCursor: true}).setDepth(2)
        soundEffectsToggleButton.on('pointerdown', () => {
            // 1) Read current state from gameState
            const current = this.gameState.gameSettings.isSoundEffectsOn;

            // 2) Flip it
            const next = !current;
            this.gameState.gameSettings.isSoundEffectsOn = next;

            // 3) Update the button label
            soundEffectsToggleButton.setText(next ? 'ON' : 'OFF');

            // 4) Persist immediately
            this.storage.save(this.gameState);

            // 5) Inform your SoundManager (so it’ll actually mute/unmute)
            this.soundManager.setSoundEffectsEnabled(next);

            // 6) Play a click if sounds are now on
            if (next) {
                this.soundManager.playClickSound();
            }
        });
        soundEffectsToggleButton.on('pointerover', () => {
            soundEffectsToggleButton.setStyle({
                color: this.colors.get('themePrimaryLight')
            })
        })
        soundEffectsToggleButton.on('pointerout', () => {
            soundEffectsToggleButton.setStyle({
                color: this.colors.get('themePrimaryDark')
            })
        })
        
        // ===== EXPORT-IMPORT SAVE DATA
        // Create buttons to trigger export/import.
        const exportImportLabel = this.add.text(this.sceneHeading.x, soundEffectsToggleTextLabel.y+50, 'Save Export/Import:', {
            fontSize:  '20px',
            color: this.colors.get('themePrimaryDark'),
            fontFamily: 'SuperComic'
        }).setDepth(2);
        const exportButton = this.add.text(exportImportLabel.x, exportImportLabel.y+30, 'Export',
            {
                fontSize:  '23px',
                color: this.colors.get('themeLight'),
                backgroundColor: this.colors.get('themeDark'),
                fontFamily: 'SuperComic',
                padding: { left: 10, right: 10, top: 5, bottom: 5 }
            })
            .setDepth(2)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.saveExportImport.showExportModal();
            })
            .on('pointerover', () => {
                exportButton.setStyle({
                    color: this.colors.get('themePrimaryLight'),
                    backgroundColor: this.colors.get('themeDark'),
                });
            })
            .on('pointerout', () => {
                exportButton.setStyle({
                    backgroundColor: this.colors.get('themeDark'),
                    color: this.colors.get('themeLight')
                });
            });
        this.importButton = this.add.text(exportButton.x+exportButton.width+10, exportButton.y, 'Import',
            {
                fontSize:  '23px',
                color: this.colors.get('themeLight'),
                backgroundColor: this.colors.get('themeDark'),
                fontFamily: 'SuperComic',
                padding: { left: 10, right: 10, top: 5, bottom: 5 }
            })
            .setDepth(2)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.saveExportImport.showImportModal();
            })
            .on('pointerover', () => {
                this.importButton.setStyle({
                    color: this.colors.get('themePrimaryLight'),
                    backgroundColor: this.colors.get('themeDark'),
                });
            })
            .on('pointerout', () => {
                this.importButton.setStyle({
                    backgroundColor: this.colors.get('themeDark'),
                    color: this.colors.get('themeLight')
                });
            });
        this.exportImportSublabel = this.add.text(exportButton.x, exportButton.y+35, 'You can use this feature to move your game progress between devices, \nand to be able to have a backup.', {
            fontSize:  '13px',
            color: this.colors.get('themePrimaryDark'),
            fontFamily: 'SuperComic'
        }).setDepth(2);
    }

}