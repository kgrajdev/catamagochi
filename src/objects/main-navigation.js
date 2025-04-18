import ColorScheme from "../lib/ColorScheme";
import Storage from "../lib/storage";

export default class MainNavigation {
    constructor(scene, gameState, soundManager) {
        this.scene = scene;
        this.colors = new ColorScheme();
        this.storage = new Storage();
        this.gameState = gameState;
        this.soundManager = soundManager;
    }

    createNavigation() {
        this.navAnchor = this.scene.add.text(530, 50, '');
        this.navItemStyle = {
            fontFamily: 'SuperComic',
            align: 'center',
            fontSize: '20px',
            color: this.colors.get('themePrimaryDark')
        };
        this.shopButton = this.scene.add.text(this.navAnchor.x, this.navAnchor.y + this.navAnchor.height, 'Shop', this.navItemStyle).setDepth(2).setInteractive({useHandCursor: true})
            .on('pointerdown', () => {
                this.soundManager.playClickSound();
                this.storage.save(this.gameState);
                this.scene.scene.start('StoreScene')
            })
            .on('pointerover', () => {
                this.shopButton.setStyle({
                    color: this.colors.get('themePrimaryLight')
                })
            }).on('pointerout', () => {
                this.shopButton.setStyle({
                    color: this.colors.get('themePrimaryDark')
                })
            });
        this.achievementsButton = this.scene.add.text(this.navAnchor.x + 50, this.navAnchor.y + this.navAnchor.height + 25, 'Achievements', this.navItemStyle).setDepth(2).setInteractive({useHandCursor: true})
            .on('pointerdown', () => {
                this.soundManager.playClickSound();
                this.storage.save(this.gameState);
                this.scene.scene.start('AchievementsScene')
            })
            .on('pointerover', () => {
                this.achievementsButton.setStyle({
                    color: this.colors.get('themePrimaryLight')
                })
            }).on('pointerout', () => {
                this.achievementsButton.setStyle({
                    color: this.colors.get('themePrimaryDark')
                })
            });
        this.settingsButton = this.scene.add.text(this.navAnchor.x + 100, this.navAnchor.y + this.navAnchor.height + 50, 'Settings', this.navItemStyle).setDepth(2).setInteractive({useHandCursor: true})
            .on('pointerdown', () => {
                this.soundManager.playClickSound();
                this.storage.save(this.gameState);
                this.scene.scene.start('SettingsScene')
            })
            .on('pointerover', () => {
                this.settingsButton.setStyle({
                    color: this.colors.get('themePrimaryLight')
                })
            }).on('pointerout', () => {
                this.settingsButton.setStyle({
                    color: this.colors.get('themePrimaryDark')
                })
            });
    }


}
