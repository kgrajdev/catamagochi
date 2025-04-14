import Storage from "../lib/storage";
import {
    DEFAULT_STATS,
    MAX_STATS,
    AP_COSTS,
    DECAY_RATES,
    COLOR_THRESHOLDS,
    PLAYER_CONFIG
} from "../lib/default-properties"
import ColorScheme from "../lib/ColorScheme";

export default class MainScene extends Phaser.Scene {

    constructor() {
        super({ key: 'MainScene' });
        this.storage = new Storage();
        this.colors = new ColorScheme();
    }

    create() {

        // ====== NAVIGATION
        this.navAnchor = this.add.text(530, 50, '');
        this.navItemStyle = {fontFamily: 'SuperComic', align: 'center', fontSize: '20px', color: this.colors.get('themeLight')};
        this.add.text(this.navAnchor.x, this.navAnchor.y+this.navAnchor.height, 'Shop', this.navItemStyle).setInteractive({useHandCursor: true})
            .on('pointerdown', () => {
                this.storage.save(this.gameState);
                this.scene.start('StoreScene')
            })
        this.add.text(this.navAnchor.x+50, this.navAnchor.y+this.navAnchor.height+25, 'Achievements', this.navItemStyle).setInteractive({useHandCursor: true})
            .on('pointerdown', () => {
                this.storage.save(this.gameState);
                this.scene.start('AchievementsScene')
            })
        this.add.text(this.navAnchor.x+100, this.navAnchor.y+this.navAnchor.height+50, 'Settings', this.navItemStyle).setInteractive({useHandCursor: true})
            .on('pointerdown', () => {
                this.storage.save(this.gameState);
                this.scene.start('SettingsScene')
            })
        // ======== NAVIGATION END


        // Load game state either from localStorage or from Defaults
        this.gameState = this.storage.load('gameState') || {
            stats: {...DEFAULT_STATS},
            AP: 40,
            coins: 500,
            lastSave: Date.now(),
            unlockedDecor: {
                bed: [],
                picture: [],
                windowL: [],
                windowR: [],
                background: ["Room1"],
                plant: [],
                platform: [],
                shelf: [],
                tree: [],
            },
            selectedDecor: {
                bed: "",
                picture: "",
                windowL: "",
                windowR: "",
                background: "Room1",
                plant: "",
                platform: "",
                shelf: "",
                tree: ""
            }
        };
        // Track stat bars + AP text
        this.statBars = {};
        this.drawUI();

        // Start stat decay timer
        this.lastTick = Date.now();


        // ======= DECOR
        // const decorState = this.storage.load('decorState') || {};
        // this.decorSelection = decorState.selectedDecor || {};
        this.renderDecor();

        // ====== CAT SPRITE
        this.catCharacter = this.add.sprite(PLAYER_CONFIG.defaultX, PLAYER_CONFIG.defaultY, 'cat-tiles-master').setScale(1.1);
        this.catCharacter.play('idle');

        // ===== INTERACTION UI
        this.createInteractionButtons()

        // Save on page exit
        window.addEventListener('beforeunload', () => {
            this.storage.save(this.gameState);
        });
        this.storage.save(this.gameState)
    }


    drawUI() {
        const barX = 50;
        const barYStart = 200;
        const barHeight = 20;
        const barWidth = 150;
        const spacing = 30;

        Object.keys(this.gameState.stats).forEach((key, index) => {
            const value = this.gameState.stats[key];
            const barY = barYStart + index * spacing;
            const label = this.add.text(barX, barY - 18, key.toUpperCase(), {
                fontSize: '14px',
                color: '#ffffff'
            });

            const bar = this.add.graphics();
            this.statBars[key] = bar;

            this.updateProgressBar(key, value);
        });

        this.apText = this.add.text(barX, barYStart + 200, `AP: ${this.gameState.AP}`, {
            fontSize: '16px',
            color: '#ffffff'
        });

        this.coinText = this.add.text(barX, barYStart + 230, `Coins: ${this.gameState.coins}`, {
            fontSize: '16px',
            color: '#ffff00'
        });
    }

    renderDecor() {
        const decorMapping = {
            background: { x: this.game.config.width/2, y: this.game.config.height/2 },
            bed: { x: 500, y: 400 },
            windowL: { x: 400, y: 200 },
            windowR: { x: 550, y: 200 },
            plant: { x: 440, y: 230 },
            platform: { x: 495, y: 210 },
            shelf: { x: 380, y: 310 },
            picture: { x: 400, y: 250 }
        };

        Object.entries(this.gameState.selectedDecor).forEach(([decorType, spriteKey]) => {
            const pos = decorMapping[decorType];
            if (!pos) return;
            if (!spriteKey) return;

            this.add.image(pos.x, pos.y, spriteKey);
        });
    }


    updateProgressBar(key, value) {
        const bar = this.statBars[key];
        bar.clear();

        const barX = 50;
        const barY = 200 + Object.keys(this.statBars).indexOf(key) * 30;
        const width = 150;
        const height = 20;

        // Background
        bar.fillStyle(0x333333);
        bar.fillRect(barX, barY, width, height);

        // Color by value
        const colorHex = this.colors.getHex(this.getColorByValue(value));
        bar.fillStyle(colorHex);
        bar.fillRect(barX, barY, width * (value / 100), height);
    }

    getColorByValue(value) {
        const v = Math.floor(value);
        if (v >= 80) return 'themeProgressBarGreen';
        if (v >= 60) return 'themeProgressBarYellow';
        if (v >= 40) return 'themeProgressBarOrange';
        if (v >= 20) return 'themeProgressBarRed';
        return 'themeProgressBarBlack';
    }

    createInteractionButtons() {

        // ==== food
        this.foodIcon = this.add.image(405, 420, 'bowl-empty').setInteractive({useHandCursor: true})
            .on('pointerdown', () => {
                this.handleAction('fillFood');
            })
        // ==== water
        this.waterIcon = this.add.image(450, 445, 'bowl-empty').setInteractive({useHandCursor: true})
            .on('pointerdown', () => {
                this.handleAction('fillWater');
            })
        // ==== tray
        this.trayIcon = this.add.image(290, 365, 'litter-tray-clean').setInteractive({useHandCursor: true})
            .on('pointerdown', () => {
                this.handleAction('cleanTray');
            })
        // ==== play
        this.playIcon = this.add.image(530, 400, 'cat-toy-sprite').setInteractive({useHandCursor: true})
            .on('pointerdown', () => {
                this.handleAction('play');
            })

    }

    handleAction(action) {
        const cost = AP_COSTS[action];
        if (this.gameState.AP < cost) {
            console.log('not enough AP')
            return;
        }

        const statKeyMap = {
            fillFood: 'food',
            fillWater: 'water',
            cleanTray: 'tray',
            play: 'happiness'
        };

        const statKey = statKeyMap[action];
        const current = this.gameState.stats[statKey];

        if (current >= MAX_STATS[statKey]) {
            console.log('already full')
            return;
        }

        this.gameState.AP -= cost;
        this.apText.setText(`AP: ${this.gameState.AP}`);

        // Apply action
        switch (action) {
            case 'fillFood':
                this.gameState.stats.food = Math.min(current + 20, MAX_STATS.food);
                break;
            case 'fillWater':
                this.gameState.stats.water = Math.min(current + 20, MAX_STATS.water);
                break;
            case 'cleanTray':
                this.gameState.stats.tray = 100;
                break;
            case 'play':
                this.gameState.stats.happiness = Math.min(current + 15, MAX_STATS.happiness);
                break;
        }

        // Animate cat
        this.animateCat(action);

        // Update UI
        this.updateProgressBar(statKey, this.gameState.stats[statKey]);
    }

    animateCat(action) {
        // ==== location of interactive UI elements
        const targetMap = {
            fillFood: {x: this.foodIcon.x, y: this.foodIcon.y},
            fillWater: {x: this.waterIcon.x, y: this.waterIcon.y},
            play: {x: this.playIcon.x, y: this.playIcon.y}
        };

        const target = targetMap[action];

        this.tweens.add({
            targets: this.catCharacter,
            x: target.x,
            y: target.y,
            duration: 500,
            onComplete: () => {
                this.catCharacter.play(this.getAnimationForAction(action));

                this.time.delayedCall(2000, () => {
                    this.catCharacter.play('idle');
                    this.catCharacter.x = PLAYER_CONFIG.defaultX;
                    this.catCharacter.y = PLAYER_CONFIG.defaultY;
                });
            }
        });
    }

    getAnimationForAction(action) {
        switch (action) {
            case 'fillFood': return 'happy';
            case 'fillWater': return 'happy';
            case 'cleanTray': return 'happy';
            case 'play': return 'excited';
            default: return 'idle';
        }
    }


    /**
     * MAIN UPDATE LOOP
     * @param time
     * @param delta
     */
    update(time, delta) {
        const now = Date.now();
        const elapsedSeconds = (now - this.lastTick) / 1000;

        if (elapsedSeconds >= 1) {
            this.lastTick = now;

            ['food', 'water', 'tray'].forEach(stat => {
                const rate = DECAY_RATES[stat];
                this.gameState.stats[stat] = Math.max(0, this.gameState.stats[stat] - rate);
                this.updateProgressBar(stat, this.gameState.stats[stat]);
            });

            // Recalculate happiness
            const avg = (this.gameState.stats.food + this.gameState.stats.water + this.gameState.stats.tray) / 3;
            this.gameState.stats.happiness = avg;
            this.updateProgressBar('happiness', avg);
        }
    }

}
