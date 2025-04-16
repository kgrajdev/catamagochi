import Storage from "../lib/storage";
import {
    DEFAULT_STATS,
    MAX_STATS,
    AP_COSTS,
    DECAY_RATES,
    COLOR_THRESHOLDS,
    PLAYER_CONFIG,
    DAILY_AWARDS
} from "../lib/default-properties"
import ColorScheme from "../lib/ColorScheme";
import MainNavigation from "../objects/main-navigation";

export default class MainScene extends Phaser.Scene {

    constructor() {
        super({ key: 'MainScene' });
        this.storage = new Storage();
        this.colors = new ColorScheme();
    }

    create() {

        // Load game state either from localStorage or from Defaults
        this.gameState = this.storage.load('gameState') || {
            stats: {...DEFAULT_STATS},
            AP: 10,
            coins: 100,
            lastSave: Date.now(),
            lastLogin: null,
            loginStreak: 0,
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

        // Check daily rewards (AP reset and cash bonus).
        this.checkDailyRewards();

        // ====== NAVIGATION
        this.mainNav = new MainNavigation(this, this.gameState);
        this.mainNav.createNavigation();
        // ======== NAVIGATION END

        // Track stat bars + AP text
        this.statBars = {};
        this.drawUI();

        // Start stat decay timer
        this.lastTick = Date.now();

        // ======= STATIC DECOR
        this.renderDecor();

        // ====== CAT SPRITE
        this.catCharacter = this.add.sprite(PLAYER_CONFIG.defaultX, PLAYER_CONFIG.defaultY, 'cat-tiles-master').setScale(1.1).setDepth(9999);
        this.catCharacter.play('idle');

        // ===== INTERACTION UI
        this.createInteractionButtons()

        // Save on page exit
        window.addEventListener('beforeunload', () => {
            this.storage.save(this.gameState);
        });
        this.storage.save(this.gameState);
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
        }).setInteractive({useHandCursor: true})
        .on('pointerdown', () => {
            this.showDailyRewardDetails(); // When the AP text is clicked, display current daily rewards.
        });
        this.coinText = this.add.text(barX, barYStart + 230, `Coins: ${this.gameState.coins}`, {
            fontSize: '16px',
            color: '#ffff00'
        }).setInteractive({useHandCursor: true})
        .on('pointerdown', () => {
            this.showDailyRewardDetails(); // When the AP text is clicked, display current daily rewards.
        });
    }

    // Helper function to update coins display (when coins change)
    updateCoinsDisplay() {
        if (this.coinText) {
            this.coinText.setText(`Coins: ${this.gameState.coins}`);
        }
    }

    // Display a temporary popup with details of today's rewards.
    showDailyRewardDetails() {
        const detailText = `Daily Rewards: \nAction Points: ${DAILY_AWARDS.dailyActionPoints} (unused AP are lost) \nDaily Cash Bonus: ${DAILY_AWARDS.cashBase + ((this.gameState.loginStreak - 1) * DAILY_AWARDS.cashIncrement)} coins \nLogin Streak: ${this.gameState.loginStreak} day(s)`;

        const popup = this.add.text(400, 100, detailText, {
            fontSize: '18px',
            color: '#00ff00',
            backgroundColor: '#000000',
            align: 'center'
        }).setOrigin(0.5).setDepth(1000);

        this.time.delayedCall(4000, () => popup.destroy());
    }

    renderDecor() {
        const decorMapping = {
            background: { x: this.game.config.width/2, y: this.game.config.height/2, depth: 999 },
            bed: { x: 500, y: 400, depth: 1000 },
            windowL: { x: 400, y: 200, depth: 1000 },
            windowR: { x: 550, y: 200, depth: 1000 },
            plant: { x: 440, y: 230, depth: 1000 },
            platform: { x: 495, y: 210, depth: 1000 },
            shelf: { x: 380, y: 310, depth: 1000 },
            picture: { x: 400, y: 250, depth: 1000 }
        };

        Object.entries(this.gameState.selectedDecor).forEach(([decorType, spriteKey]) => {
            const pos = decorMapping[decorType];
            if (!pos) return;
            if (!spriteKey) return;

            this.add.image(pos.x, pos.y, spriteKey).setDepth(pos.depth);
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
        this.foodIcon = this.add.image(405, 420, 'bowl-empty').setInteractive({useHandCursor: true}).setDepth(9999)
            .on('pointerdown', () => {
                this.handleAction('fillFood');
            })
        // ==== water
        this.waterIcon = this.add.image(450, 445, 'bowl-empty').setInteractive({useHandCursor: true}).setDepth(9999)
            .on('pointerdown', () => {
                this.handleAction('fillWater');
            })
        // ==== tray
        this.trayIcon = this.add.image(290, 365, 'litter-tray-clean').setInteractive({useHandCursor: true}).setDepth(9999)
            .on('pointerdown', () => {
                this.handleAction('cleanTray');
            })
        // ==== play
        this.playIcon = this.add.image(530, 400, 'cat-toy-sprite').setInteractive({useHandCursor: true}).setDepth(9999)
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
        // save
        this.storage.save(this.gameState);
    }

    animateCat(action) {
        if (action === 'cleanTray') return; // do not animate cat to the tray

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

    checkDailyRewards() {
        const today = new Date().toISOString().slice(0, 10); // Format: YYYY-MM-DD
        let lastLogin = this.gameState.lastLogin;
        let loginStreak = this.gameState.loginStreak || 0;

        // Only process if this is a new day.
        if (lastLogin === today) {
            // Already logged in today; no need to change AP or award daily cash.
            return;
        } else {
            // Determine if the login is consecutive.
            if (!lastLogin) {
                // First login; start a new streak.
                loginStreak = 1;
            } else {
                // Compare dates to see if login is consecutive.
                const oneDay = 24 * 60 * 60 * 1000;
                const lastLoginDate = new Date(lastLogin);
                const currentDate = new Date(today);
                const diffDays = Math.round(Math.abs((currentDate - lastLoginDate) / oneDay));
                if (diffDays === 1) {
                    // Consecutive login – increase streak.
                    loginStreak++;
                } else {
                    // Not consecutive – reset streak.
                    loginStreak = 1;
                }
            }

            // Award a fixed amount of AP; discard previous AP.
            this.gameState.AP = DAILY_AWARDS.dailyActionPoints;

            // Award cash bonus based on the login streak.
            // For example: cash = base cash + ((streak - 1) * daily increment)
            const dailyCash = DAILY_AWARDS.cashBase + ((loginStreak - 1) * DAILY_AWARDS.cashIncrement);
            this.gameState.coins += dailyCash;

            // Update login data in the game state.
            this.gameState.lastLogin = today;
            this.gameState.loginStreak = loginStreak;

            // Update the UI to show the new AP and coin totals.
            this.updateAPDisplay();
            this.updateCoinsDisplay();

            // Save the updated game state.
            this.storage.save('gameState', this.gameState);
        }
    }
    updateAPDisplay() {
        if(this.apText){
            this.apText.setText(`AP: ${this.gameState.AP}`);
        }
    }

}
