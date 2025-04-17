import ColorScheme from "../lib/ColorScheme";
import Storage from "../lib/storage";

export default class MainNavigation {
    constructor(scene, gameState) {
        this.scene = scene;
        this.colors = new ColorScheme();
        this.storage = new Storage();
        this.gameState = gameState;
    }

   createNavigation() {
       this.navAnchor = this.scene.add.text(530, 50, '');
       this.navItemStyle = {fontFamily: 'SuperComic', align: 'center', fontSize: '20px', color: this.colors.get('themeLight')};
       this.scene.add.text(this.navAnchor.x, this.navAnchor.y+this.navAnchor.height, 'Shop', this.navItemStyle).setInteractive({useHandCursor: true})
           .on('pointerdown', () => {
               this.storage.save(this.gameState);
               this.scene.scene.start('StoreScene')
           })
       this.scene.add.text(this.navAnchor.x+50, this.navAnchor.y+this.navAnchor.height+25, 'Achievements', this.navItemStyle).setInteractive({useHandCursor: true})
           .on('pointerdown', () => {
               this.storage.save(this.gameState);
               this.scene.scene.start('AchievementsScene')
           })
       this.scene.add.text(this.navAnchor.x+100, this.navAnchor.y+this.navAnchor.height+50, 'Settings', this.navItemStyle).setInteractive({useHandCursor: true})
           .on('pointerdown', () => {
               this.storage.save(this.gameState);
               this.scene.scene.start('SettingsScene')
           })
   }


}
