import {DECOR_CATALOG, PLAYER_CONFIG} from "../lib/default-properties";
import Storage from "../lib/storage";
import ColorScheme from "../lib/ColorScheme";
import StoreRenderer from "../objects/store-renderer";
import SoundManager from "../objects/sound-manager";
import AchievementManager from "../lib/AchievementManager";

export default class StoreScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StoreScene' });
        this.storage = new Storage();
        this.colors = new ColorScheme();
        this.backgroundsContainer = [];
        this.windowsLContainer = [];
        this.windowsRContainer = [];
        this.wallDecorsContainer = [];
        this.plantsContainer = [];
        this.bedsContainer = [];
        this.platformsContainer = [];
        this.shelvesContainer = [];
        this.treesContainer = [];
    }

    create() {
        this.soundManager = new SoundManager(this);
        this.add.image(this.game.config.width/2, this.game.config.height/2, 'bgImage').setDepth(1)
        this.gameState = this.storage.load('gameState');
        this.achMgr = new AchievementManager(this.gameState, this.storage);
        this.drawShop();

        // ==== HEADING SECTION
        this.sceneHeading = this.add.text((this.game.config.width-this.game.config.width)+25, 25, 'Shop', {fontFamily: 'SuperComic', align: 'center', fontSize: '20px', color: this.colors.get('themePrimaryDark')})
            .setOrigin(0, 0.5).setDepth(2)
        this.sceneSubHeading = this.add.text(this.sceneHeading.x, this.sceneHeading.y+this.sceneHeading.height, `Unlock decor for ${this.gameState.catName ?? 'Meowlo'}`, {fontFamily: 'SuperComic', align: 'center', fontSize: '13px', color: this.colors.get('themePrimaryDark')})
            .setOrigin(0, 0.5).setDepth(2)

        // ====== NAVIGATION
        this.returnButton = this.add.text(this.game.config.width-150, this.sceneHeading.y, 'Return', {fontFamily: 'SuperComic', align: 'center', fontSize: '20px', color: this.colors.get('themePrimaryDark')}).setInteractive({useHandCursor: true}).setDepth(2)
            .on('pointerdown', () => {
                this.soundManager.playClickSound();
                this.scene.start('MainScene')
            }).on('pointerover', () =>{
                this.returnButton.setStyle({
                    color: this.colors.get('themePrimaryLight')
                })
            }).on('pointerout', () =>{
                this.returnButton.setStyle({
                    color: this.colors.get('themePrimaryDark')
                })
            })

        // ===== COINS
        this.coinsLabel = this.add.text(this.sceneHeading.x+350, this.sceneHeading.y, 'Coins: ', {fontFamily: 'SuperComic', align: 'center', fontSize: '20px', color: this.colors.get('themePrimaryDark')}).setDepth(2)
        this.coinsValue = this.add.text(this.coinsLabel.x+this.coinsLabel.width+5, this.coinsLabel.y, this.gameState.coins, {fontFamily: 'SuperComic', align: 'center', fontSize: '20px', color: this.colors.get('themePrimaryDark')}).setDepth(2)

        // ==== PREVIEW HOLDER
        this.previewImageInfo = this.add.text(this.game.config.width-200, this.game.config.height-130, 'hover over any of the item names\nto see their preview', {fontFamily: 'SuperComic', align: 'center', fontSize: '11px', color: this.colors.get('themePrimaryDark')}).setDepth(2).setOrigin(0.5).setAlpha(0.5);
        this.previewImage = this.add.image(this.game.config.width-200, this.game.config.height-130, 'decor-holder').setDepth(2).setAlpha(0);
    }

    drawShop() {
        const tabs = [
            {
                key: 'room',
                label: 'Room',
                containers: ['backgroundsContainer', 'windowsLContainer', 'windowsRContainer'],
            },
            {
                key: 'wallDecor',
                label: 'Wall Decor',
                containers: ['wallDecorsContainer'],
            },
            {
                key: 'plant',
                label: 'Plants',
                containers: ['plantsContainer'],
            },
            {
                key: 'furniture',
                label: 'Furniture',
                containers: ['bedsContainer', 'platformsContainer', 'shelvesContainer', 'treesContainer'],
            },
        ];


        // ==== init tabs
        let xOffset = 25;
        this.tabTextObjects = {};

        tabs.forEach((tab, index) => {
            const tabText = this.add.text(xOffset, 100, tab.label, {
                fontFamily: 'SuperComic',
                align: 'center',
                fontSize: '15px',
                color: this.colors.get('themePrimaryDark'),
            }).setInteractive({ useHandCursor: true }).setDepth(2);

            this.tabTextObjects[tab.key] = tabText;

            tabText.on('pointerdown', () => {
                this.soundManager.playClickSound();
                this.showTab(tab.key);
            });
            tabText.on('pointerover', () => {
                tabText.setStyle({
                    color: this.colors.get('themePrimaryLight'),
                })
            });
            tabText.on('pointerout', () => {
                tabText.setStyle({
                    color: this.colors.get('themePrimaryDark'),
                })
            });

            xOffset += tabText.width + 25;
        });

        // ==== render tab content
        const renderer = new StoreRenderer(this, DECOR_CATALOG, this.gameState, this.colors, this.soundManager);
        renderer.renderCategory('background', this.backgroundsContainer, 25, 120);
        renderer.renderCategory('windowL', this.windowsLContainer, 25, 140);
        renderer.renderCategory('windowR', this.windowsRContainer, 25,160);
        renderer.renderCategory('picture', this.wallDecorsContainer, 25,-260);
        renderer.renderCategory('plant', this.plantsContainer, 25,-440);
        renderer.renderCategory('bed', this.bedsContainer, 25,-560);
        renderer.renderCategory('platform', this.platformsContainer, 25,-540);
        renderer.renderCategory('shelf', this.shelvesContainer, 350,-800);
        renderer.renderCategory('tree', this.treesContainer, 25,-670);


        this.showTab = (selectedKey) => {

            // Hide all containers first
            tabs.forEach(tab => {
                tab.containers.forEach(containerKey => {
                    this[containerKey]?.forEach?.(item => item.setVisible(false));
                });
            });

            // Then show selected tab's containers
            const selectedTab = tabs.find(tab => tab.key === selectedKey);
            selectedTab.containers.forEach(containerKey => {
                this[containerKey]?.forEach?.(item => item.setVisible(true));
            });
        };
        // by default, show just the first tab content
        this.showTab('room');

    }

    purchaseItem(category, item) {
        if (this.gameState.coins < item.price) {
            console.log('not enough coins')
            return;
        }
        this.achMgr.recordEvent('unlock'); // tracking for achievements

        this.gameState.coins -= item.price;
        this.gameState.unlockedDecor[category].push(item.id);
        this.selectDecor(category, item.id);
    }

    selectDecor(category, itemId) {
        this.gameState.selectedDecor[category] = itemId;
        this.storage.save(this.gameState)
        this.scene.restart(); // refresh visuals
    }

    previewItem(itemId) {
        this.previewImageInfo.setAlpha(0);
        this.previewImage.setTexture(itemId).setAlpha(1);
        // let bg = null;
        // let img = null;
        // bg = this.add.rectangle(this.game.config.width-200, this.game.config.height-150, 200, 200, this.colors.getHex('themeTertiary', 0.99))
        // img = this.add.image(this.game.config.width-200, this.game.config.height-150, itemId).setScale(1);
        //
        // this.time.delayedCall(900, () => {
        //     console.log('remove preview')
        //     bg.destroy()
        //     img.destroy()
        //     // this.input.enabled = true;
        // });
    }
}
