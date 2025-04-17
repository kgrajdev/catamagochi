import Storage from "../lib/storage";
import {
    DEFAULT_STATS,
    MAX_STATS,
    AP_COSTS,
    DECAY_RATES,
    PLAYER_CONFIG,
    DAILY_AWARDS,
    RANDOM_IDLE_BEHAVIORS
} from "../lib/default-properties"
import ColorScheme from "../lib/ColorScheme";
import MainNavigation from "../objects/main-navigation";

export default class MainScene extends Phaser.Scene {

    constructor() {
        super({ key: 'MainScene' });
        this.storage = new Storage();
        this.colors = new ColorScheme();
        this.actionButtons = this.actionButtons || {};
    }


    create() {

        // Load game state either from localStorage or from Defaults
        this.gameState = this.storage.load('gameState') || {
            stats: {...DEFAULT_STATS},
            AP: 10,
            coins: 5100,
            catName: null,
            lastSave: Date.now(),
            lastLogin: null,
            loginStreak: 0,
            gameSettings: {
                bgMusicVolume: 0.5,
                isBgMusicOn: true
            },
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

        if (!this.gameState.catName) {
            this.showCatNamePrompt()
        }

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
        this.catCharacter = this.add.sprite(PLAYER_CONFIG.defaultX, PLAYER_CONFIG.defaultY, 'cat-tiles-master').setScale(1.1).setDepth(1001);
        // Choose one of the random idle behaviors
        let behavior = Phaser.Utils.Array.GetRandom(RANDOM_IDLE_BEHAVIORS);
        if (behavior.key === 'sleeping') {
            this.catCharacter.play('sleeping');
        } else if (behavior.key === 'chill') {
            this.catCharacter.play('chill');
        } else {
            this.catCharacter.play('idle');
        }

        // ===== INTERACTION UI
        // Create action buttons for food, water, tray, and play.
        // Adjust x, y values as needed.
        this.createActionButton('fillFood', 405, 420);
        this.createActionButton('fillWater', 450, 445);
        this.createActionButton('cleanTray', 290, 365);
        this.createActionButton('play', 530, 400);

        // Save on page exit
        window.addEventListener('beforeunload', () => {
            this.storage.save(this.gameState);
        });
        this.storage.save(this.gameState);

        // Start the random idle process.
        // Build a Phaser polygon once:
        // Four‐corner walk area
        this.walkAreaPoints = [
            { x: 480, y: 220 },   // top‑left
            { x: 680, y: 330 },   // top‑right
            { x: 540, y: 440 },   // bottom‑right
            { x: 330, y: 330 }    // bottom‑left
        ];
        // Build the polygon from those points
        this.walkPolygon = new Phaser.Geom.Polygon(
            this.walkAreaPoints.flatMap(p => [ p.x, p.y ])
        );

        // this.walkPolygon = new Phaser.Geom.Polygon([
        //     480,220,
        //     680,330,
        //     540,440,
        //     330,330
        // ]);
        this.scheduleRandomIdle();

        // ======== INITIALISE BACKGROUND MUSIC
        if (!this.sound.get('bgMusic')) {
            this.bgMusic = this.sound.add('bgMusic', {
                loop: true,
                volume: this.gameState.gameSettings.bgMusicVolume
            });
            if (this.gameState.gameSettings.isBgMusicOn) {
                this.bgMusic.play();
            }
            this.registry.set('bgMusic', this.bgMusic); // store in registry for access from other scenes
        }
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


    /**
     * Creates an interactive action button.
     * @param {string} action - The action identifier (e.g., "fillFood", "fillWater", "cleanTray", "play").
     * @param {number} x - X coordinate for the button.
     * @param {number} y - Y coordinate for the button.
     */
    createActionButton(action, x, y) {
        let textureKey;
        switch (action) {
            case 'fillFood':
                textureKey = (this.gameState.stats.food >= MAX_STATS.food) ? 'bowl-food-full' : 'bowl-empty';
                break;
            case 'fillWater':
                textureKey = (this.gameState.stats.water >= MAX_STATS.water) ? 'bowl-water-full' : 'bowl-empty';
                break;
            case 'cleanTray':
                textureKey = (this.gameState.stats.tray >= MAX_STATS.tray) ? 'litter-tray-clean' : 'litter-tray-dirty';
                break;
            case 'play':
                // For play, you might use a specific sprite from a spritesheet:
                textureKey = 'cat-toy-sprite';
                break;
            default:
                textureKey = 'default'; // Fallback texture if needed.
        }

        const button = this.add.image(x, y, textureKey).setInteractive({useHandCursor: true}).setDepth(9999);
        // Add hover effect (e.g., slight scale up)
        button.on('pointerover', () => button.setScale(1.05));
        button.on('pointerout', () => button.setScale(1));

        // Bind the pointerdown event to execute the action:
        button.on('pointerdown', () => {
            this.handleAction(action);
        });

        // Store the button reference for later texture updates
        this.actionButtons[action] = button;

        return button;
    }

    handleAction(action) {
        const cost = AP_COSTS[action];
        if (this.gameState.AP < cost) {
            console.log('not enough AP')
            return;
        }
        // Cancel any idle timers because the cat is now busy
        if (this.idleTimer) {
            this.idleTimer.remove(false);
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
        // For the action animation: move the cat to the target, do the action, then return the cat.
        // After completing the action, ensure the cat goes back to idle:
        this.animateCat(action, () => {
            // Callback after the action animation is finished.
            this.catCharacter.play('idle');
            // Schedule the next random idle behavior.
            this.scheduleRandomIdle();
        });

        // Update the UI action button textures based on the new game state.
        this.updateActionButtonTextures();

        // Update UI
        this.updateProgressBar(statKey, this.gameState.stats[statKey]);
        // save
        this.storage.save(this.gameState);
    }

    updateActionButtonTextures() {
        if (this.actionButtons) {
            // Food button:
            const foodFull = this.gameState.stats.food >= MAX_STATS.food;
            const foodTexture = foodFull ? 'bowl-food-full' : 'bowl-empty';
            this.actionButtons['fillFood'].setTexture(foodTexture);
            this.actionButtons['fillFood'].setDepth(9999);
            this.actionButtons['fillFood'].setAlpha(foodFull ? 0.6 : 1); // gray out if full

            // Water button:
            const waterFull = this.gameState.stats.water >= MAX_STATS.water;
            const waterTexture = waterFull ? 'bowl-water-full' : 'bowl-empty';
            this.actionButtons['fillWater'].setTexture(waterTexture);
            this.actionButtons['fillWater'].setDepth(9999);
            this.actionButtons['fillWater'].setAlpha(waterFull ? 0.6 : 1);

            // Litter tray:
            const trayClean = this.gameState.stats.tray >= MAX_STATS.tray;
            const trayTexture = trayClean ? 'litter-tray-clean' : 'litter-tray-dirty';
            this.actionButtons['cleanTray'].setTexture(trayTexture);
            this.actionButtons['cleanTray'].setDepth(9999);
            this.actionButtons['cleanTray'].setAlpha(trayClean ? 0.6 : 1);

            // For 'play', you might always show the same sprite, or update it if you want to change states.
        }
    }



    animateCat(action) {
        if (action === 'cleanTray') return; // do not animate cat to the tray

        // ==== location of interactive UI elements
        const targetMap = {
            fillFood: {x: this.actionButtons['fillFood'].x, y: this.actionButtons['fillFood'].y},
            fillWater: {x: this.actionButtons['fillWater'].x, y: this.actionButtons['fillWater'].y},
            // play: {x: this.playIcon.x, y: this.playIcon.y}
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
    scheduleRandomIdle() {
        // Clear any previous idle timer if necessary.
        if (this.idleTimer) {
            this.idleTimer.remove(false);
        }

        // Set a random delay between idle behaviors (e.g., 5 to 10 seconds)
        const delay = Phaser.Math.Between(1000, 5000);
        this.idleTimer = this.time.delayedCall(delay, () => {
            this.triggerRandomIdleBehavior();
        });
    }
    triggerRandomIdleBehavior() {
        // If the cat is busy with another action (like an ongoing tween), you might want to check that here.
        if (!this.catCharacter) return;

        // Choose one of the random idle behaviors
        let behavior = Phaser.Utils.Array.GetRandom(RANDOM_IDLE_BEHAVIORS);

        if (behavior.key === 'walk') {
            // Special case: behavior that includes movement
            this.performWalkBehavior(behavior.duration);
        } else {
            // For simple behaviors that only change the animation
            this.catCharacter.play(behavior.key);
            // After the specified duration, go back to idle
            this.time.delayedCall(behavior.duration, () => {
                this.catCharacter.play('idle');
                this.scheduleRandomIdle(); // schedule next idle behavior
            });
        }
    }
    performWalkBehavior() {
        // pick a valid random point
        const dest = this.getRandomPointInPolygon();

        // switch to your walk/run anim
        this.catCharacter.play('running');

        // calculate a duration so speed feels constant
        const dx = dest.x - this.catCharacter.x;
        const dy = dest.y - this.catCharacter.y;
        const distance = Math.hypot(dx, dy);
        const speed = 100; // px/sec
        const duration = (distance / speed) * 1000;

        // tween the cat over
        this.tweens.add({
            targets: this.catCharacter,
            x: dest.x,
            y: dest.y,
            duration,
            ease: 'Linear',
            onComplete: () => {
                // once arrived, play sleeping (or chill, etc.)
                this.catCharacter.play('sleeping');
                this.time.delayedCall(10000, () => {
                    this.catCharacter.play('idle');
                    this.scheduleRandomIdle();
                });
            }
        });
    }



    /**
     * @returns {{x:number,y:number}} a point inside this.walkPolygon
     */
    getRandomPointInPolygon() {
        // 2a) Compute bounding box from the corner array
        const pts = this.walkAreaPoints;
        let minX = pts[0].x, maxX = pts[0].x,
            minY = pts[0].y, maxY = pts[0].y;

        pts.forEach(p => {
            if (p.x < minX) minX = p.x;
            if (p.x > maxX) maxX = p.x;
            if (p.y < minY) minY = p.y;
            if (p.y > maxY) maxY = p.y;
        });

        // 2b) Rejection sample
        let x, y;
        do {
            x = Phaser.Math.Between(minX, maxX);
            y = Phaser.Math.Between(minY, maxY);
        } while (!Phaser.Geom.Polygon.Contains(this.walkPolygon, x, y));

        return { x, y };
    }




    showCatNamePrompt() {

    }

}
