import Storage from "../lib/storage";
import {
    DEFAULT_STATS,
    MAX_STATS,
    AP_COSTS,
    DECAY_RATES,
    PLAYER_CONFIG,
    DAILY_AWARDS,
    RANDOM_IDLE_BEHAVIORS,
    ACTION_BUTTON_CONFIG, ACTION_DESCRIPTIONS, COLOR_THRESHOLDS
} from "../lib/default-properties"
import ColorScheme from "../lib/ColorScheme";
import MainNavigation from "../objects/main-navigation";
import SoundManager from "../objects/sound-manager";
import AchievementManager from "../lib/AchievementManager";
import {devTestWalkArea} from "../lib/dev-utilities";
import GameUI from "../objects/game-ui";
import NotificationManager from "../lib/notificationManager";
import TooltipManager from "../lib/tooltipManager";

export default class MainScene extends Phaser.Scene {

    constructor() {
        super({ key: 'MainScene' });
        this.storage = new Storage();
        this.colors = new ColorScheme();
        this.notifications = new NotificationManager(this);
        this.actionButtons = this.actionButtons || {};
        this.skin = null;
    }


    create() {
        this.add.image(this.game.config.width/2, this.game.config.height/2, 'bgImage').setDepth(1)
        this.add.image(this.game.config.width/2, this.game.config.height/1.05, 'bgBuildingImage').setDepth(1)

        // Load game state either from localStorage or from Defaults
        this.gameState = this.storage.load() || {
            stats: {...DEFAULT_STATS},
            AP: 13,
            coins: 1110,
            catName: null,
            lastSave: Date.now(),
            lastLogin: null,
            selectedStoreTab: null,
            gameSettings: {
                bgMusicVolume: 0.5,
                isBgMusicOn: true,
                isSoundEffectsOn: true
            },
            achievementCountTrackers: {
                feedCount: 0,
                waterCount: 0,
                playCount: 0,
                unlockCount: 0,
                totalDays: 0,
                loginStreak: 0
            },
            purchasedApPacks: [],
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
                cat: ["AllCatsBlack"],
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
                tree: "",
                cat: "AllCatsBlack"
            }
        };

        this.skin = this.gameState.selectedDecor.cat;    // e.g. 'AllCatsGrey'

        if (!this.gameState.catName) {
            this.showCatNamePrompt()
        }
        // ====== ACHIEVEMENTS
        const achievementMgr = new AchievementManager(
            this.gameState,
            this.storage,
            this.game.events
        );
        this.registry.set('achMgr', achievementMgr);
        this.achMgr = this.registry.get('achMgr');

        // bind listener so we can easily remove it later
        this._onAchUnlocked = this.onAchievementUnlocked.bind(this);

        // subscribe
        this.achMgr.on('achievementUnlocked', this._onAchUnlocked);

        // unsubscribe when this scene shuts down
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            this.achMgr.emitter.off('achievementUnlocked', this._onAchUnlocked);
        });

        // ==== INIT SOUND MANAGER
        this.soundManager = new SoundManager(this);

        // Check daily rewards (AP reset and cash bonus).
        this.checkDailyRewards();

        // ====== NAVIGATION
        this.mainNav = new MainNavigation(this, this.gameState, this.soundManager);
        this.mainNav.createNavigation();

        // ===== UI MANAGEMENT
        this.ui = new GameUI(this, this.gameState, this.colors);
        this.ui.drawUI();
        // Example: wire up AP click to show details
        this.ui.apText.on("pointerdown", () => this.showAPDetails());

        // Start stat decay timer
        this.lastTick = Date.now();

        // ======= STATIC DECOR
        this.renderDecor();

        // ====== CAT SPRITE
        this.catCharacter = this.add.sprite(PLAYER_CONFIG.defaultX, PLAYER_CONFIG.defaultY, `cat-tiles-${this.skin}`).setScale(1.1).setDepth(1001);
        this.catCharacter.play(`idle-${this.skin}`);


        // Choose one of the random idle behaviors
        let behavior = Phaser.Utils.Array.GetRandom(RANDOM_IDLE_BEHAVIORS);
        if (behavior.key === 'sleeping') {
            this.catCharacter.play(`idle-${this.skin}`);
        } else if (behavior.key === 'chill') {
            this.catCharacter.play(`idle-${this.skin}`);
        } else {
            this.catCharacter.play(`idle-${this.skin}`);
        }

        // ===== INTERACTION UI
        this.createActionButton();

        // Save on page exit
        window.addEventListener('beforeunload', () => {
            this.storage.save(this.gameState);
        });
        this.storage.save(this.gameState);

        // Four‐corner walk area
        this.walkAreaPoints = [
            { x: 455, y: 300 },
            { x: 590, y: 380 },
            { x: 510, y: 430 },
            { x: 400, y: 360 }
        ];
        // ===== FOR DEV TESTING ONLY
        // devTestWalkArea(this.walkAreaPoints)

        // Build the polygon from those points
        this.walkPolygon = new Phaser.Geom.Polygon(
            this.walkAreaPoints.flatMap(p => [ p.x, p.y ])
        );
        // ====== INITIALISE RANDOM ANIMATIONS
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

        // initial trigger to play sound
        this.playRandomBackgroundMeowSounds();

        // ======= INSTANTIATE TOOLTIPS
        this.tooltip = new TooltipManager(this);
    }

    // show a floating toast
    onAchievementUnlocked(def) {
        this.soundManager.playAchievementSound();
        this.notifications.showNotification('Achievement Unlocked', `${def.desc}`)
    }

    playRandomBackgroundMeowSounds() {
        // Play a random sound
        this.soundManager.playRandomMeowSound();
        // Set the next random interval (e.g., between 9–20 seconds)
        const delay = Phaser.Math.Between(9000, 20000);
        // Use a delayed call to play the next one
        this.time.delayedCall(delay, () => this.playRandomBackgroundMeowSounds(), null, this);
    }


    // Helper function to update coins display (when coins change)
    updateCoinsDisplay() {
        if (this.coinText) {
            this.coinText.setText(`Coins: ${this.gameState.coins}`);
        }
    }

    // Display a temporary popup with details of today's rewards.
    showAPDetails() {
        this.notifications.showNotification('Daily Reward', `AP: ${DAILY_AWARDS.dailyActionPoints}\nCoins: ${DAILY_AWARDS.cashBase + ((this.gameState.achievementCountTrackers.loginStreak - 1) * DAILY_AWARDS.cashIncrement)}\nCurrent Day-Streak: ${this.gameState.achievementCountTrackers.loginStreak}`, 1250, 'left')
    }

    renderDecor() {
        const decorMapping = {
            background: { x: this.game.config.width/2, y: this.game.config.height/2, depth: 999 },
            bed: { x: 600, y: 325, depth: 1000 },
            windowL: { x: 400, y: 200, depth: 1000 },
            windowR: { x: 600, y: 215, depth: 1000 },
            plant: { x: 440, y: 235, depth: 1001 },
            platform: { x: 495, y: 210, depth: 1000 },
            shelf: { x: 345, y: 295, depth: 1000 },
            tree: { x: 675, y: 330, depth: 1000 },
            picture: { x: 320, y: 210, depth: 1000 }
        };

        Object.entries(this.gameState.selectedDecor).forEach(([decorType, spriteKey]) => {
            const pos = decorMapping[decorType];
            if (!pos) return;
            if (!spriteKey) return;

            this.add.image(pos.x, pos.y, spriteKey).setDepth(pos.depth);
        });
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
     * Creates an interactive action buttons.
     */
    createActionButton() {
        this.actionButtons = {};

        Object.entries(ACTION_BUTTON_CONFIG).forEach(([action, cfg], i) => {

            // Bottom: empty state
            const emptyImg = this.add.image(cfg.x, cfg.y, cfg.emptyKey).setInteractive({ useHandCursor: true }).setDepth(999);
            // Top: full state
            const fullImg  = this.add.image(cfg.x, cfg.y, cfg.fullKey).setInteractive({ useHandCursor: true }).setDepth(999);

            // Make clicks go through either image
            emptyImg.on('pointerdown', () => this.handleAction(action));
            fullImg.on('pointerdown', () => this.handleAction(action));

            let actionButtonImages = [emptyImg, fullImg];
            actionButtonImages.forEach((btnImage) => {
                btnImage.on('pointerover', () => {
                    this.tooltip.show(`${ACTION_DESCRIPTIONS[action]}, ${AP_COSTS[action]} Action Points`);
                })
                btnImage.on('pointerout', () => {
                    this.tooltip.hide();
                })
            })

            this.actionButtons[action] = { emptyImg, fullImg, ...cfg };
        });
    }

    handleAction(action) {
        const cost = AP_COSTS[action];
        if (this.gameState.AP < cost) {
            console.log('not enough AP') //todo: add nicer message
            this.notifications.showNotification('Sorry', 'Not Enough Action Points')
            return;
        }
        // play sound
        this.soundManager.playClickSound();

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
            console.log('already full') //todo: add nicer message
            return;
        }

        this.gameState.AP -= cost;
        this.ui.updateAP();

        // Apply action
        switch (action) {
            case 'fillFood':
                this.gameState.stats.food = Math.min(current + 20, MAX_STATS.food);
                break;
            case 'fillWater':
                this.gameState.stats.water = Math.min(current + 20, MAX_STATS.water);
                break;
            case 'cleanTray':
                this.gameState.stats.tray = Math.min(current + 100, MAX_STATS.water);
                break;
            case 'play':
                this.gameState.stats.happiness = Math.min(current + 15, MAX_STATS.happiness);
                break;
        }

        // track actions for achievements
        if (action === 'fillFood')  this.registry.get('achMgr').recordEvent('feed');
        if (action === 'fillWater') this.registry.get('achMgr').recordEvent('water');
        if (action === 'play')      this.registry.get('achMgr').recordEvent('play');


        // Animate cat
        // For the action animation: move the cat to the target, do the action, then return the cat.
        // After completing the action, ensure the cat goes back to idle:
        this.animateCat(action, () => {
            // Callback after the action animation is finished.
            this.catCharacter.play(`idle-${this.skin}`);
            // Schedule the next random idle behavior.
            this.scheduleRandomIdle();
        });

        // Update the UI action button textures based on the new game state.
        this.updateActionButtonTextures();

        // Update UI
        // this.updateProgressBar(statKey, this.gameState.stats[statKey]);
        // save
        this.storage.save(this.gameState);
    }

    updateActionButtonTextures() {

        Object.values(this.actionButtons).forEach(cfg => {
            const { statKey, lowThresh, highThresh, fullImg } = cfg;
            const val = this.gameState.stats[statKey];

            // compute alpha: 1 at highThresh, 0 at lowThresh, clamp
            let alpha = (val - lowThresh) / (highThresh - lowThresh);
            alpha = Phaser.Math.Clamp(alpha, 0, 1);

            fullImg.setAlpha(alpha);
            fullImg.setDepth(999);  // keep it on top
        });

    }



    animateCat(action) {
        if (action === 'cleanTray') return; // do not animate cat to the tray

        // ==== location of interactive UI elements
        const targetMap = {
            fillFood: {x: this.actionButtons['fillFood'].x, y: this.actionButtons['fillFood'].y},
            fillWater: {x: this.actionButtons['fillWater'].x, y: this.actionButtons['fillWater'].y},
            play: {x: this.actionButtons['play'].x, y: this.actionButtons['play'].y}
        };

        const target = targetMap[action];
        this.catCharacter.play(`running-${this.skin}`);

        this.tweens.add({
            targets: this.catCharacter,
            x: target.x,
            y: target.y,
            duration: 500,
            onComplete: () => {
                this.catCharacter.play(this.getAnimationForAction(action)+'-'+this.skin);

                this.time.delayedCall(2000, () => {
                    this.catCharacter.play(`idle-${this.skin}`);
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

            ["food", "water", "tray"].forEach(stat => {
                this.gameState.stats[stat] = Math.max(
                    0,
                    this.gameState.stats[stat] - DECAY_RATES[stat]
                );
                this.ui.updateStat(stat, this.gameState.stats[stat]);
            });

            // Recalculate happiness
            const avg = (
                this.gameState.stats.food +
                this.gameState.stats.water +
                this.gameState.stats.tray
            ) / 3;
            this.gameState.stats.happiness = avg;
            this.ui.updateStat("happiness", avg);

            this.updateHealth(elapsedSeconds);

            this.updateActionButtonTextures()
        }
    }

    /**
     * Decrease health when food or water < 20,
     * stop when both ≥20, and rapidly recover when both =100.
     * If health ≤0, go to GameOverScene.
     * @param {number} dt — seconds since last tick
     */
    updateHealth(dt) {
        const s = this.gameState.stats;
        const rate = DECAY_RATES.health;     // 0.5 per sec
        let h = s.health;

        const foodLow  = s.food  < COLOR_THRESHOLDS.red.min;   // <20
        const waterLow = s.water < COLOR_THRESHOLDS.red.min;   // <20

        if (foodLow || waterLow) {
            // decay health
            h = Math.max(0, h - rate * dt);
        } else if (s.food === MAX_STATS.food && s.water === MAX_STATS.water) {
            // rapid recovery: e.g. 5× faster
            h = Math.min(MAX_STATS.health, h + rate * 5 * dt);
        }
        s.health = h;
        this.ui.updateStat('health', h);

        if (h <= 0) {
            // immediate Game Over
            this.scene.start('GameOverScene');
        }
    }

    checkDailyRewards() {
        const today = new Date().toISOString().slice(0, 10); // Format: YYYY-MM-DD
        let lastLogin = this.gameState.lastLogin;
        let loginStreak = this.gameState.achievementCountTrackers.loginStreak || 0;

        // Only process if this is a new day.
        if (lastLogin === today) {
            // Already logged in today; no need to change AP or award daily cash.
            return;
        } else {
            // On daily login:
            this.registry.get('achMgr').recordEvent('login'); // track for achievements

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
            this.gameState.achievementCountTrackers.loginStreak = loginStreak;

            // Update the UI to show the new AP and coin totals.
            this.updateAPDisplay();
            this.updateCoinsDisplay();

            // todo: add notification about consecutive login bonus award

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
            this.catCharacter.play(`${behavior.key}-${this.skin}`);
            // After the specified duration, go back to idle
            this.time.delayedCall(behavior.duration, () => {
                this.catCharacter.play(`idle-${this.skin}`);
                this.scheduleRandomIdle(); // schedule next idle behavior
            });
        }
    }
    performWalkBehavior() {
        // pick a valid random point
        const dest = this.getRandomPointInPolygon();

        // switch to your walk/run anim
        this.catCharacter.play(`running-${this.skin}`);

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
                this.catCharacter.play(`sleeping-${this.skin}`);
                this.time.delayedCall(10000, () => {
                    this.catCharacter.play(`idle-${this.skin}`);
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
        // console.log('show intro name option')
    }
}
