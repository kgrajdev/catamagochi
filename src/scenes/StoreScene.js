import {DECOR_CATALOG, PLAYER_CONFIG} from "../lib/default-properties";
import Storage from "../lib/storage";
import ColorScheme from "../lib/ColorScheme";

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
        this.furnituresContainer = [];
    }

    create() {
        this.gameState = this.storage.load('gameState');
        this.drawShop();

        // ==== HEADING SECTION
        this.sceneHeading = this.add.text((this.game.config.width-this.game.config.width)+25, 25, 'Shop', {fontFamily: 'SuperComic', align: 'center', fontSize: '20px', color: this.colors.get('themeLight')})
            .setOrigin(0, 0.5)
        this.sceneSubHeading = this.add.text(this.sceneHeading.x, this.sceneHeading.y+this.sceneHeading.height, `Unlock decor for ${PLAYER_CONFIG.catName}`, {fontFamily: 'SuperComic', align: 'center', fontSize: '13px', color: this.colors.get('themeLight')})
            .setOrigin(0, 0.5)

        // ====== NAVIGATION
        this.add.text(this.game.config.width-150, this.sceneHeading.y, 'Return', {fontFamily: 'SuperComic', align: 'center', fontSize: '20px', color: this.colors.get('themeLight')}).setInteractive({useHandCursor: true})
            .on('pointerdown', () =>{
                this.scene.start('MainScene')
            })

        // ===== COINS
        this.coinsLabel = this.add.text(this.sceneHeading.x+350, this.sceneHeading.y, 'Coins: ', {fontFamily: 'SuperComic', align: 'center', fontSize: '20px', color: this.colors.get('themeLight')})
        this.coinsValue = this.add.text(this.coinsLabel.x+this.coinsLabel.width+5, this.coinsLabel.y, this.gameState.coins, {fontFamily: 'SuperComic', align: 'center', fontSize: '20px', color: this.colors.get('themeLight')})

    }

    drawShop() {
        let yOffset = 20;

        // ==== tabs
        this.roomTab = this.add.text(25, 100, 'Room', {fontFamily: 'SuperComic', align: 'center', fontSize: '15px', color: this.colors.get('themeLight')}).setInteractive({useHandCursor: true});
        this.wallDecorTab = this.add.text(this.roomTab.x+this.roomTab.width+25, this.roomTab.y, 'Wall Decor', {fontFamily: 'SuperComic', align: 'center', fontSize: '15px', color: this.colors.get('themeLight')}).setInteractive({useHandCursor: true});
        this.plantTab = this.add.text(this.wallDecorTab.x+this.wallDecorTab.width+25, this.wallDecorTab.y, 'Plants', {fontFamily: 'SuperComic', align: 'center', fontSize: '15px', color: this.colors.get('themeLight')}).setInteractive({useHandCursor: true});
        this.furnitureTab = this.add.text(this.plantTab.x+this.plantTab.width+25, this.plantTab.y, 'Furniture', {fontFamily: 'SuperComic', align: 'center', fontSize: '15px', color: this.colors.get('themeLight')}).setInteractive({useHandCursor: true});



        DECOR_CATALOG.background.forEach((item, index) => {

            let container = this.add.container(25,130, []);

            let isUnlocked = this.gameState.unlockedDecor.background.includes(item.id);
            let itemName = this.add.text(0, yOffset, `${item.name}:`, {fontFamily: 'SuperComic', fontSize: '17px', color: this.colors.get('themeLight')})
                .setName('itemName')
                container.add(itemName);
            if (!isUnlocked) {
                let itemCost = this.add.text(itemName.x+itemName.width+20, yOffset, item.price, {fontFamily: 'SuperComic', fontSize: '15px', color: this.colors.get('themeLight')})
                    .setName('itemCost');
                let itemCostIcon = this.add.image(itemCost.x+itemCost.width+15, itemCost.y+10, 'coin')
                    .setName('itemCostIcon').setScale(0.05)
                let itemButton = this.add.text(itemCostIcon.x+itemCostIcon.displayWidth+15, yOffset, `${isUnlocked ? 'Select' : 'Unlock'}`, {fontFamily: 'SuperComic', fontSize: '15px', color: this.colors.get('themeLight')})
                    .setName('itemButton').setInteractive({useHandCursor: true});
                itemButton.on('pointerdown', () => {
                    if (isUnlocked) {
                        this.selectDecor('background', item.id);
                    } else {
                        this.purchaseItem('background', item);
                    }
                });
                container.add([itemCost, itemCostIcon, itemButton]);
            } else {
                let itemCost = this.add.text(itemName.x+itemName.width+20, yOffset, '', {fontFamily: 'SuperComic', fontSize: '15px', color: this.colors.get('themeLight')})
                    .setName('itemCost');
                let itemCostIcon = this.add.image(itemCost.x+itemCost.width, itemCost.y+10, 'coin')
                    .setName('itemCostIcon').setScale(0.05).setAlpha(0);
                let isSelected = this.gameState.selectedDecor.background.includes(item.id);
                let itemButton = this.add.text(itemCostIcon.x+itemCostIcon.displayWidth, yOffset, `${isSelected ? 'Selected' : 'Select'}`, {fontFamily: 'SuperComic', fontSize: '15px', color: this.colors.get('themeLight')})
                    .setName('itemButton').setInteractive({useHandCursor: true});
                itemButton.on('pointerdown', () => {
                    if (!isSelected) {
                        this.selectDecor('background', item.id);
                    } else {
                    }
                });
                container.add([itemCost, itemCostIcon, itemButton]);
            }


            yOffset += 30;
            this.backgroundsContainer.push(container);
        });

        DECOR_CATALOG.windowL.forEach((item, index) => {
            let container = this.add.container(25,150, []);

            let isUnlocked = this.gameState.unlockedDecor.windowL.includes(item.id);
            let itemName = this.add.text(0, yOffset, `${item.name}:`, {fontFamily: 'SuperComic', fontSize: '17px', color: this.colors.get('themeLight')})
                .setName('itemName')
            container.add(itemName);
            if (!isUnlocked) {
                let itemCost = this.add.text(itemName.x+itemName.width+20, yOffset, item.price, {fontFamily: 'SuperComic', fontSize: '15px', color: this.colors.get('themeLight')})
                    .setName('itemCost');
                let itemCostIcon = this.add.image(itemCost.x+itemCost.width+15, itemCost.y+10, 'coin')
                    .setName('itemCostIcon').setScale(0.05)
                let itemButton = this.add.text(itemCostIcon.x+itemCostIcon.displayWidth+15, yOffset, `${isUnlocked ? 'Select' : 'Unlock'}`, {fontFamily: 'SuperComic', fontSize: '15px', color: this.colors.get('themeLight')})
                    .setName('itemButton').setInteractive({useHandCursor: true});
                itemButton.on('pointerdown', () => {
                    if (isUnlocked) {
                        this.selectDecor('windowL', item.id);
                    } else {
                        this.purchaseItem('windowL', item);
                    }
                });
                container.add([itemCost, itemCostIcon, itemButton]);
            } else {
                let itemCost = this.add.text(itemName.x+itemName.width+20, yOffset, '', {fontFamily: 'SuperComic', fontSize: '15px', color: this.colors.get('themeLight')})
                    .setName('itemCost');
                let itemCostIcon = this.add.image(itemCost.x+itemCost.width, itemCost.y+10, 'coin')
                    .setName('itemCostIcon').setScale(0.05).setAlpha(0);
                let isSelected = this.gameState.selectedDecor.windowL.includes(item.id);
                let itemButton = this.add.text(itemCostIcon.x+itemCostIcon.displayWidth, yOffset, `${isSelected ? 'Selected' : 'Select'}`, {fontFamily: 'SuperComic', fontSize: '15px', color: this.colors.get('themeLight')})
                    .setName('itemButton').setInteractive({useHandCursor: true});
                itemButton.on('pointerdown', () => {
                    if (!isSelected) {
                        this.selectDecor('windowL', item.id);
                    } else {
                    }
                });
                container.add([itemCost, itemCostIcon, itemButton]);
            }


            yOffset += 30;
            this.windowsLContainer.push(container);
        });

        DECOR_CATALOG.windowR.forEach((item, index) => {
            let container = this.add.container(450,30, []);

            let isUnlocked = this.gameState.unlockedDecor.windowR.includes(item.id);
            let itemName = this.add.text(0, yOffset, `${item.name}:`, {fontFamily: 'SuperComic', fontSize: '17px', color: this.colors.get('themeLight')})
                .setName('itemName')
            container.add(itemName);
            if (!isUnlocked) {
                let itemCost = this.add.text(itemName.x+itemName.width+20, yOffset, item.price, {fontFamily: 'SuperComic', fontSize: '15px', color: this.colors.get('themeLight')})
                    .setName('itemCost');
                let itemCostIcon = this.add.image(itemCost.x+itemCost.width+15, itemCost.y+10, 'coin')
                    .setName('itemCostIcon').setScale(0.05)
                let itemButton = this.add.text(itemCostIcon.x+itemCostIcon.displayWidth+15, yOffset, `${isUnlocked ? 'Select' : 'Unlock'}`, {fontFamily: 'SuperComic', fontSize: '15px', color: this.colors.get('themeLight')})
                    .setName('itemButton').setInteractive({useHandCursor: true});
                itemButton.on('pointerdown', () => {
                    if (isUnlocked) {
                        this.selectDecor('windowR', item.id);
                    } else {
                        this.purchaseItem('windowR', item);
                    }
                });
                container.add([itemCost, itemCostIcon, itemButton]);
            } else {
                let itemCost = this.add.text(itemName.x+itemName.width+20, yOffset, '', {fontFamily: 'SuperComic', fontSize: '15px', color: this.colors.get('themeLight')})
                    .setName('itemCost');
                let itemCostIcon = this.add.image(itemCost.x+itemCost.width, itemCost.y+10, 'coin')
                    .setName('itemCostIcon').setScale(0.05).setAlpha(0);
                let isSelected = this.gameState.selectedDecor.windowR.includes(item.id);
                let itemButton = this.add.text(itemCostIcon.x+itemCostIcon.displayWidth, yOffset, `${isSelected ? 'Selected' : 'Select'}`, {fontFamily: 'SuperComic', fontSize: '15px', color: this.colors.get('themeLight')})
                    .setName('itemButton').setInteractive({useHandCursor: true});
                itemButton.on('pointerdown', () => {
                    if (!isSelected) {
                        this.selectDecor('windowR', item.id);
                    } else {
                    }
                });
                container.add([itemCost, itemCostIcon, itemButton]);
            }


            yOffset += 30;
            this.windowsRContainer.push(container);
        });

        this.roomTab.on('pointerdown', () => {
            this.backgroundsContainer.forEach((item) => {
                item.setVisible(true)
            })
            this.windowsLContainer.forEach((item) => {
                item.setVisible(true)
            })
            this.windowsRContainer.forEach((item) => {
                item.setVisible(true)
            })
            //todo: add others i.e wall decors container, plants container etc
        })
        this.wallDecorTab.on('pointerdown', () => {
            this.backgroundsContainer.forEach((item) => {
                item.setVisible(false)
            })
            this.windowsLContainer.forEach((item) => {
                item.setVisible(false)
            })
            this.windowsRContainer.forEach((item) => {
                item.setVisible(false)
            })
        })
    }

    purchaseItem(category, item) {
        if (this.gameState.coins < item.price) {
            console.log('not enough coins')
            return;
        }

        this.gameState.coins -= item.price;

        // if (!this.state.unlockedDecor[category]) this.gameState.unlockedDecor[category] = [];
        this.gameState.unlockedDecor[category].push(item.id);

        this.selectDecor(category, item.id);
        this.storage.save(this.gameState);
        this.scene.restart(); // refresh visuals
    }

    selectDecor(category, itemId) {
        this.gameState.selectedDecor[category] = itemId;
        this.storage.save(this.gameState)
        this.scene.restart(); // refresh visuals
    }

}
