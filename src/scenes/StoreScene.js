import { DECOR_CATALOG, ACTION_POINTS_PACKS } from "../lib/default-properties";
import Storage from "../lib/storage";
import ColorScheme from "../lib/ColorScheme";
import StoreRenderer from "../objects/store-renderer";
import SoundManager from "../objects/sound-manager";
import { ACHIEVEMENT_DEFS } from '../lib/achievements';
import NotificationManager from "../lib/notificationManager";

export default class StoreScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StoreScene' });
        this.gameStorage = new Storage();
        this.colors = new ColorScheme();
        this.notifications = new NotificationManager(this);

        // containers for each category
        this.backgroundsContainer   = [];
        this.windowsLContainer      = [];
        this.windowsRContainer      = [];
        this.wallDecorsContainer    = [];
        this.plantsContainer        = [];
        this.bedsContainer          = [];
        this.platformsContainer     = [];
        this.shelvesContainer       = [];
        this.treesContainer         = [];
        this.catsContainer         = [];
        this.actionPointsContainer  = [];
    }

    create() {
        this.soundManager = new SoundManager(this);
        // background image
        this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'bgImage').setDepth(1);

        // load state
        this.gameState = this.gameStorage.load();

        // achievements
        this.achMgr = this.registry.get('achMgr');
        this._onAchUnlocked = this.onAchievementUnlocked.bind(this);
        this.achMgr.on('achievementUnlocked', this._onAchUnlocked);
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            this.achMgr.emitter.off('achievementUnlocked', this._onAchUnlocked);
        });

        // headings
        this.sceneHeading = this.add.text(25, 25, 'Shop', {
            fontFamily: 'SuperComic',
            fontSize: '20px',
            color: this.colors.get('themePrimaryDark')
        }).setDepth(2);

        this.sceneSubHeading = this.add.text(
            25,
            25 + this.sceneHeading.height,
            `Unlock decor for ${this.gameState.catName || 'Meowlo'}`,
            {
                fontFamily: 'SuperComic',
                fontSize: '13px',
                color: this.colors.get('themePrimaryDark')
            }
        ).setDepth(2);

        // return button
        this.returnButton = this.add.text(this.cameras.main.width - 150, 25, 'Return', {
            fontFamily: 'SuperComic',
            fontSize: '20px',
            color: this.colors.get('themePrimaryDark')
        })
            .setInteractive({ useHandCursor: true })
            .setDepth(2)
            .on('pointerdown', () => {
                this.soundManager.playClickSound();
                this.scene.start('MainScene');
            })
            .on('pointerover', () => this.returnButton.setStyle({ color: this.colors.get('themePrimaryLight') }))
            .on('pointerout',  () => this.returnButton.setStyle({ color: this.colors.get('themePrimaryDark') }));

        // coins display
        this.coinsLabel = this.add.text(25 + 350, 25, 'Coins: ', {
            fontFamily: 'SuperComic',
            fontSize: '20px',
            color: this.colors.get('themePrimaryDark')
        }).setDepth(2);
        this.coinsValue = this.add.text(
            this.coinsLabel.x + this.coinsLabel.width + 5,
            this.coinsLabel.y,
            this.gameState.coins,
            { fontFamily: 'SuperComic', fontSize: '20px', color: this.colors.get('themePrimaryDark') }
        ).setDepth(2);
        this.coinsIcon = this.add.image(this.coinsValue.x+this.coinsValue.width+15, this.coinsValue.y+10, 'coin')
            .setScale(0.05)
            .setDepth(2);

        // preview
        this.previewImageInfo = this.add.text(
            this.cameras.main.width - 200,
            this.cameras.main.height - 130,
            'hover over any item name\nto see preview',
            { fontFamily: 'SuperComic', fontSize: '11px', color: this.colors.get('themePrimaryDark'), align: 'center' }
        ).setDepth(2).setOrigin(0.5).setAlpha(0.5);

        this.previewImage = this.add.image(
            this.cameras.main.width - 200,
            this.cameras.main.height - 130,
            'decor-holder'
        ).setDepth(2).setAlpha(0);

        // renderer instance
        this.storeRender = new StoreRenderer(
            this,
            DECOR_CATALOG,
            this.gameState,
            this.colors,
            this.soundManager
        );

        this.drawShop();
    }

    drawShop() {
        const tabs = [
            { key: 'room',      label: 'Room',      containers: ['backgroundsContainer','windowsLContainer','windowsRContainer'] },
            { key: 'wallDecor', label: 'Wall Decor',containers: ['wallDecorsContainer'] },
            { key: 'plant',     label: 'Plants',    containers: ['plantsContainer'] },
            { key: 'furniture', label: 'Furniture', containers: ['bedsContainer','platformsContainer','shelvesContainer','treesContainer'] },
            { key: 'cats', label: 'Cat', containers: ['catsContainer'] },
            { key: 'gameplay',  label: 'Gameplay',  containers: ['actionPointsContainer'] },
        ];

        // tabs
        let xOffset = 25;
        this.tabTextObjects = {};
        tabs.forEach(tab => {
            const txt = this.add.text(xOffset, 100, tab.label, {
                fontFamily: 'SuperComic',
                fontSize: '15px',
                color: tab.key === this.gameState.selectedStoreTab ? this.colors.get('themePrimaryLight') : this.colors.get('themePrimaryDark')
            })
                .setInteractive({ useHandCursor: true })
                .setDepth(2)
                .on('pointerdown', () => {
                    if (tab.key !== this.gameState.selectedStoreTab) {
                        this.soundManager.playClickSound();
                        this.showTab(tab.key);
                    }
                })
                .on('pointerover', () => txt.setStyle({ color: this.colors.get('themePrimaryLight') }))
                .on('pointerout',  () => txt.setStyle({ color: this.colors.get('themePrimaryDark') }));

            this.tabTextObjects[tab.key] = txt;
            xOffset += txt.width + 25;
        });

        // **Render categories using only the type**:
        this.storeRender.renderCategory('background', this.backgroundsContainer);
        this.storeRender.renderCategory('windowL',    this.windowsLContainer);
        this.storeRender.renderCategory('windowR',    this.windowsRContainer);
        this.storeRender.renderCategory('picture',    this.wallDecorsContainer);
        this.storeRender.renderCategory('plant',      this.plantsContainer);
        this.storeRender.renderCategory('bed',        this.bedsContainer);
        this.storeRender.renderCategory('platform',   this.platformsContainer);
        this.storeRender.renderCategory('shelf',      this.shelvesContainer);
        this.storeRender.renderCategory('tree',       this.treesContainer);
        this.storeRender.renderCategory('cat',       this.catsContainer);
        this.storeRender.renderStoreGameplaySection('actionPoints', this.actionPointsContainer);


        // tab switcher
        this.showTab = (key) => {
            this.gameState.selectedStoreTab = key;
            this.gameStorage.save(this.gameState);

            // hide all
            tabs.forEach(t =>
                t.containers.forEach(cKey =>
                    this[cKey].forEach(item => item.setVisible(false))
                )
            );

            // show only selected
            tabs.find(t => t.key === key)
                .containers.forEach(cKey =>
                this[cKey].forEach(item => item.setVisible(true))
            );
        };

        // initial
        this.showTab(this.gameState.selectedStoreTab || 'room');
    }

    purchaseItem(category, item) {

        if (this.gameState.coins < item.price) {
            this.notifications.showNotification('Sorry', 'Not Enough Coins');
            return;
        }

        // spend & persist
        this.gameState.coins -= item.price;
        // this.gameStorage.save(this.gameState);

        // unlock decor
        this.gameState.unlockedDecor[category].push(item.id);
        this.gameStorage.save(this.gameState);

        // achievements
        this.achMgr.recordEvent('unlock');

        // update UI
        this.coinsValue.setText(this.gameState.coins);
        this.storeRender.updateCategory(category);
        // this.showAchievementToastIfAny();
    }

    purchaseAP(pack) {
        if (this.gameState.coins < pack.price) {
            this.notifications.showNotification('Sorry', 'Not Enough Coins');
            return;
        }
        this.gameState.coins -= pack.price;
        this.gameState.purchasedApPacks.push(pack.id);
        this.gameState.AP += pack.points;
        this.gameStorage.save(this.gameState);
        this.scene.restart();
    }

    selectDecor(category, itemId) {
        this.gameState.selectedDecor[category] = itemId;
        this.gameStorage.save(this.gameState);
        this.storeRender.updateCategory(category);
    }

    previewItem(itemId = null) {
        if (itemId.includes("AllCats")) {
            return;
        }
        this.previewImageInfo.setAlpha(0);
        this.previewImage.setAlpha(0);
        if (itemId) {
            this.previewImage.setTexture(itemId).setAlpha(1);
        }
    }

    onAchievementUnlocked(def) {
        this.soundManager.playAchievementSound();
        this.notifications.showNotification('Achievement Unlocked', `${def.desc}`);
    }
}
