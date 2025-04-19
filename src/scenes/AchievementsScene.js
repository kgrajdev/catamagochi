import Phaser from  'phaser';
import SoundManager from "../objects/sound-manager";
import ColorScheme from "../lib/ColorScheme";
import AchievementManager from "../lib/AchievementManager";
import Storage from "../lib/storage";
import {ACHIEVEMENT_DEFS} from "../lib/achievements";

export default class AchievementsScene extends Phaser.Scene {

    constructor() {
        super({key: 'AchievementsScene'});
        this.colors = new ColorScheme();
        this.storage = new Storage()
    }

    init(data) {
        // 1) Load state & init manager
        this.gameState = data.gameState;
        this.achMgr = data.achMgr; // passed from main scene
    }

    preload() {
    }

    create(){
        this.add.image(this.game.config.width/2, this.game.config.height/2, 'bgImage').setDepth(1)
        this.soundManager = new SoundManager(this);

        // ==== HEADING SECTION
        this.sceneHeading = this.add.text((this.game.config.width-this.game.config.width)+25, 25, 'Achievements', {fontFamily: 'SuperComic', align: 'center', fontSize: '20px', color: this.colors.get('themePrimaryDark')})
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

        // ======= ACHIEVEMENT LIST
        // 2) Prepare lookup sets
        const claimed   = new Set(this.gameState.claimedAchievements || []);
        const unlocked  = new Set(this.gameState.unlockedAchievements || []);

        // 3) Render each achievement
        let y = 75; // top edge of section
        ACHIEVEMENT_DEFS.forEach(def => {

            const isUnlocked = unlocked.has(def.id);
            const isClaimed  = claimed.has(def.id);
            const color      = isUnlocked ? '#ffffff' : this.colors.get('themePrimaryDark');

            // Description text
            const desc = this.add.text(25, y, def.desc, {
                fontFamily: 'SuperComic',
                fontSize: '15px',
                color: this.colors.get('themePrimaryDark')
            }).setDepth(2);

            // If already claimed, dim it
            if (isClaimed) {
                // desc.setAlpha(0.33);
            }

            // If unlocked & not yet claimed → show Claim button
            if (isUnlocked && !isClaimed) {

                const btn = this.add.text(400, y, `Claim +${def.reward}`, {
                    fontFamily: 'SuperComic',
                    fontSize: '16px',
                    color: this.colors.get('themePrimaryDark')
                }).setInteractive({ useHandCursor: true }).setDepth(2);

                btn.on('pointerdown', () => {
                    if (this.achMgr.claimAchievement(def.id)) {
                        // desc.setAlpha(0.33);
                        btn.setText('Claimed').disableInteractive();
                    }
                });
                btn.on('pointerover', () => {
                    btn.setStyle({
                        color: this.colors.get('themePrimaryLight')
                    })
                }).on('pointerout', () => {
                    btn.setStyle({
                        color: this.colors.get('themePrimaryDark')
                    })
                })
                let coinIcon = this.add.image(btn.x+btn.width+15, y+10,'coin')
                    .setName('itemCostIcon')
                    .setScale(0.05)
                    .setDepth(2)
                    .setAlpha(isClaimed ? 0: 1)

            } else if (!isUnlocked) {
                this.add.text(400, y, 'Locked', {
                    fontFamily: 'SuperComic',
                    fontSize: '16px',
                    color: this.colors.get('themePrimaryDark')}
                ).setDepth(2);
            } else if (isClaimed) {
                this.add.text(400, y, 'Claimed', {
                    fontFamily: 'SuperComic',
                    fontSize: '16px',
                    color: this.colors.get('themePrimaryDark')}
                ).setDepth(2);
            }

            y += 35;
        });

    }


}