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
        this.bedsContainer = [];
        this.platformsContainer = [];
        this.shelvesContainer = [];
        this.treesContainer = [];
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

            let container = this.add.container(25,120, []);

            let isUnlocked = this.gameState.unlockedDecor.background.includes(item.id);
            let itemName = this.add.text(0, yOffset, `${item.name}:`, {fontFamily: 'SuperComic', fontSize: '17px', color: this.colors.get('themeLight')})
                .setName('itemName').setInteractive({useHandCursor: true});
            itemName.on('pointerdown', () => {
                this.previewItem(item.id);
            });
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
            let container = this.add.container(25,140, []);

            let isUnlocked = this.gameState.unlockedDecor.windowL.includes(item.id);
            let itemName = this.add.text(0, yOffset, `${item.name}:`, {fontFamily: 'SuperComic', fontSize: '17px', color: this.colors.get('themeLight')})
                .setName('itemName').setInteractive({useHandCursor: true});
            itemName.on('pointerdown', () => {
                this.previewItem(item.id);
            });
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
            let container = this.add.container(25,160, []);

            let isUnlocked = this.gameState.unlockedDecor.windowR.includes(item.id);
            let itemName = this.add.text(0, yOffset, `${item.name}:`, {fontFamily: 'SuperComic', fontSize: '17px', color: this.colors.get('themeLight')})
                .setName('itemName').setInteractive({useHandCursor: true});
            itemName.on('pointerdown', () => {
                this.previewItem(item.id);
            });
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
        DECOR_CATALOG.picture.forEach((item, index) => {
            let container = this.add.container(25,-260, []);

            let isUnlocked = this.gameState.unlockedDecor.picture.includes(item.id);
            let itemName = this.add.text(0, yOffset, `${item.name}:`, {fontFamily: 'SuperComic', fontSize: '17px', color: this.colors.get('themeLight')})
                .setName('itemName').setInteractive({useHandCursor: true});
            itemName.on('pointerdown', () => {
                this.previewItem(item.id);
            });
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
                        this.selectDecor('picture', item.id);
                    } else {
                        this.purchaseItem('picture', item);
                    }
                });
                container.add([itemCost, itemCostIcon, itemButton]);
            } else {
                let itemCost = this.add.text(itemName.x+itemName.width+20, yOffset, '', {fontFamily: 'SuperComic', fontSize: '15px', color: this.colors.get('themeLight')})
                    .setName('itemCost');
                let itemCostIcon = this.add.image(itemCost.x+itemCost.width, itemCost.y+10, 'coin')
                    .setName('itemCostIcon').setScale(0.05).setAlpha(0);
                let isSelected = this.gameState.selectedDecor.picture.includes(item.id);
                let itemButton = this.add.text(itemCostIcon.x+itemCostIcon.displayWidth, yOffset, `${isSelected ? 'Selected' : 'Select'}`, {fontFamily: 'SuperComic', fontSize: '15px', color: this.colors.get('themeLight')})
                    .setName('itemButton').setInteractive({useHandCursor: true});
                itemButton.on('pointerdown', () => {
                    if (!isSelected) {
                        this.selectDecor('picture', item.id);
                    } else {
                    }
                });
                container.add([itemCost, itemCostIcon, itemButton]);
            }


            yOffset += 30;
            this.wallDecorsContainer.push(container);
        });
        DECOR_CATALOG.plant.forEach((item, index) => {
            let container = this.add.container(25,-440, []);

            let isUnlocked = this.gameState.unlockedDecor.plant.includes(item.id);
            let itemName = this.add.text(0, yOffset, `${item.name}:`, {fontFamily: 'SuperComic', fontSize: '17px', color: this.colors.get('themeLight')})
                .setName('itemName').setInteractive({useHandCursor: true});
            itemName.on('pointerdown', () => {
                this.previewItem(item.id);
            });
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
                        this.selectDecor('plant', item.id);
                    } else {
                        this.purchaseItem('picture', item);
                    }
                });
                container.add([itemCost, itemCostIcon, itemButton]);
            } else {
                let itemCost = this.add.text(itemName.x+itemName.width+20, yOffset, '', {fontFamily: 'SuperComic', fontSize: '15px', color: this.colors.get('themeLight')})
                    .setName('itemCost');
                let itemCostIcon = this.add.image(itemCost.x+itemCost.width, itemCost.y+10, 'coin')
                    .setName('itemCostIcon').setScale(0.05).setAlpha(0);
                let isSelected = this.gameState.selectedDecor.plant.includes(item.id);
                let itemButton = this.add.text(itemCostIcon.x+itemCostIcon.displayWidth, yOffset, `${isSelected ? 'Selected' : 'Select'}`, {fontFamily: 'SuperComic', fontSize: '15px', color: this.colors.get('themeLight')})
                    .setName('itemButton').setInteractive({useHandCursor: true});
                itemButton.on('pointerdown', () => {
                    if (!isSelected) {
                        this.selectDecor('plant', item.id);
                    } else {
                    }
                });
                container.add([itemCost, itemCostIcon, itemButton]);
            }


            yOffset += 30;
            this.plantsContainer.push(container);
        });
        DECOR_CATALOG.bed.forEach((item, index) => {
            let container = this.add.container(25,-560, []);

            let isUnlocked = this.gameState.unlockedDecor.bed.includes(item.id);
            let itemName = this.add.text(0, yOffset, `${item.name}:`, {fontFamily: 'SuperComic', fontSize: '17px', color: this.colors.get('themeLight')})
                .setName('itemName').setInteractive({useHandCursor: true});
            itemName.on('pointerdown', () => {
                this.previewItem(item.id);
            });
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
                        this.selectDecor('bed', item.id);
                    } else {
                        this.purchaseItem('bed', item);
                    }
                });
                container.add([itemCost, itemCostIcon, itemButton]);
            } else {
                let itemCost = this.add.text(itemName.x+itemName.width+20, yOffset, '', {fontFamily: 'SuperComic', fontSize: '15px', color: this.colors.get('themeLight')})
                    .setName('itemCost');
                let itemCostIcon = this.add.image(itemCost.x+itemCost.width, itemCost.y+10, 'coin')
                    .setName('itemCostIcon').setScale(0.05).setAlpha(0);
                let isSelected = this.gameState.selectedDecor.bed.includes(item.id);
                let itemButton = this.add.text(itemCostIcon.x+itemCostIcon.displayWidth, yOffset, `${isSelected ? 'Selected' : 'Select'}`, {fontFamily: 'SuperComic', fontSize: '15px', color: this.colors.get('themeLight')})
                    .setName('itemButton').setInteractive({useHandCursor: true});
                itemButton.on('pointerdown', () => {
                    if (!isSelected) {
                        this.selectDecor('bed', item.id);
                    } else {
                    }
                });
                container.add([itemCost, itemCostIcon, itemButton]);
            }


            yOffset += 30;
            this.bedsContainer.push(container);
        });
        DECOR_CATALOG.platform.forEach((item, index) => {
            let container = this.add.container(25,-540, []);

            let isUnlocked = this.gameState.unlockedDecor.platform.includes(item.id);
            let itemName = this.add.text(0, yOffset, `${item.name}:`, {fontFamily: 'SuperComic', fontSize: '17px', color: this.colors.get('themeLight')})
                .setName('itemName').setInteractive({useHandCursor: true});
            itemName.on('pointerdown', () => {
                this.previewItem(item.id);
            });
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
                        this.selectDecor('platform', item.id);
                    } else {
                        this.purchaseItem('platform', item);
                    }
                });
                container.add([itemCost, itemCostIcon, itemButton]);
            } else {
                let itemCost = this.add.text(itemName.x+itemName.width+20, yOffset, '', {fontFamily: 'SuperComic', fontSize: '15px', color: this.colors.get('themeLight')})
                    .setName('itemCost');
                let itemCostIcon = this.add.image(itemCost.x+itemCost.width, itemCost.y+10, 'coin')
                    .setName('itemCostIcon').setScale(0.05).setAlpha(0);
                let isSelected = this.gameState.selectedDecor.platform.includes(item.id);
                let itemButton = this.add.text(itemCostIcon.x+itemCostIcon.displayWidth, yOffset, `${isSelected ? 'Selected' : 'Select'}`, {fontFamily: 'SuperComic', fontSize: '15px', color: this.colors.get('themeLight')})
                    .setName('itemButton').setInteractive({useHandCursor: true});
                itemButton.on('pointerdown', () => {
                    if (!isSelected) {
                        this.selectDecor('platform', item.id);
                    } else {
                    }
                });
                container.add([itemCost, itemCostIcon, itemButton]);
            }


            yOffset += 30;
            this.platformsContainer.push(container);
        });
        DECOR_CATALOG.shelf.forEach((item, index) => {
            let container = this.add.container(350,-800, []);

            let isUnlocked = this.gameState.unlockedDecor.shelf.includes(item.id);
            let itemName = this.add.text(0, yOffset, `${item.name}:`, {fontFamily: 'SuperComic', fontSize: '17px', color: this.colors.get('themeLight')})
                .setName('itemName').setInteractive({useHandCursor: true});
            itemName.on('pointerdown', () => {
                this.previewItem(item.id);
            });
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
                        this.selectDecor('shelf', item.id);
                    } else {
                        this.purchaseItem('shelf', item);
                    }
                });
                container.add([itemCost, itemCostIcon, itemButton]);
            } else {
                let itemCost = this.add.text(itemName.x+itemName.width+20, yOffset, '', {fontFamily: 'SuperComic', fontSize: '15px', color: this.colors.get('themeLight')})
                    .setName('itemCost');
                let itemCostIcon = this.add.image(itemCost.x+itemCost.width, itemCost.y+10, 'coin')
                    .setName('itemCostIcon').setScale(0.05).setAlpha(0);
                let isSelected = this.gameState.selectedDecor.shelf.includes(item.id);
                let itemButton = this.add.text(itemCostIcon.x+itemCostIcon.displayWidth, yOffset, `${isSelected ? 'Selected' : 'Select'}`, {fontFamily: 'SuperComic', fontSize: '15px', color: this.colors.get('themeLight')})
                    .setName('itemButton').setInteractive({useHandCursor: true});
                itemButton.on('pointerdown', () => {
                    if (!isSelected) {
                        this.selectDecor('shelf', item.id);
                    } else {
                    }
                });
                container.add([itemCost, itemCostIcon, itemButton]);
            }


            yOffset += 30;
            this.shelvesContainer.push(container);
        });
        DECOR_CATALOG.tree.forEach((item, index) => {
            let container = this.add.container(25,-670, []);

            let isUnlocked = this.gameState.unlockedDecor.tree.includes(item.id);
            let itemName = this.add.text(0, yOffset, `${item.name}:`, {fontFamily: 'SuperComic', fontSize: '17px', color: this.colors.get('themeLight')})
                .setName('itemName').setInteractive({useHandCursor: true});
            itemName.on('pointerdown', () => {
                this.previewItem(item.id);
            });
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
                        this.selectDecor('tree', item.id);
                    } else {
                        this.purchaseItem('tree', item);
                    }
                });
                container.add([itemCost, itemCostIcon, itemButton]);
            } else {
                let itemCost = this.add.text(itemName.x+itemName.width+20, yOffset, '', {fontFamily: 'SuperComic', fontSize: '15px', color: this.colors.get('themeLight')})
                    .setName('itemCost');
                let itemCostIcon = this.add.image(itemCost.x+itemCost.width, itemCost.y+10, 'coin')
                    .setName('itemCostIcon').setScale(0.05).setAlpha(0);
                let isSelected = this.gameState.selectedDecor.tree.includes(item.id);
                let itemButton = this.add.text(itemCostIcon.x+itemCostIcon.displayWidth, yOffset, `${isSelected ? 'Selected' : 'Select'}`, {fontFamily: 'SuperComic', fontSize: '15px', color: this.colors.get('themeLight')})
                    .setName('itemButton').setInteractive({useHandCursor: true});
                itemButton.on('pointerdown', () => {
                    if (!isSelected) {
                        this.selectDecor('tree', item.id);
                    } else {
                    }
                });
                container.add([itemCost, itemCostIcon, itemButton]);
            }


            yOffset += 30;
            this.treesContainer.push(container);
        });

        // ====== DEFAULT IS HIDDEN
        this.wallDecorsContainer.forEach((item) => {
            item.setVisible(false)
        })
        this.shelvesContainer.forEach((item) => {
            item.setVisible(false)
        })
        this.plantsContainer.forEach((item) => {
            item.setVisible(false)
        })
        this.bedsContainer.forEach((item) => {
            item.setVisible(false)
        })
        this.platformsContainer.forEach((item) => {
            item.setVisible(false)
        })
        this.treesContainer.forEach((item) => {
            item.setVisible(false)
        })

        // ======= TABS
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
            this.wallDecorsContainer.forEach((item) => {
                item.setVisible(false)
            })
            this.plantsContainer.forEach((item) => {
                item.setVisible(false)
            })
            this.bedsContainer.forEach((item) => {
                item.setVisible(false)
            })
            this.platformsContainer.forEach((item) => {
                item.setVisible(false)
            })
            this.shelvesContainer.forEach((item) => {
                item.setVisible(false)
            })
            this.treesContainer.forEach((item) => {
                item.setVisible(false)
            })
        })
        this.wallDecorTab.on('pointerdown', () => {
            this.wallDecorsContainer.forEach((item) => {
                item.setVisible(true)
            })
            this.backgroundsContainer.forEach((item) => {
                item.setVisible(false)
            })
            this.windowsLContainer.forEach((item) => {
                item.setVisible(false)
            })
            this.windowsRContainer.forEach((item) => {
                item.setVisible(false)
            })
            this.plantsContainer.forEach((item) => {
                item.setVisible(false)
            })
            this.bedsContainer.forEach((item) => {
                item.setVisible(false)
            })
            this.platformsContainer.forEach((item) => {
                item.setVisible(false)
            })
            this.shelvesContainer.forEach((item) => {
                item.setVisible(false)
            })
            this.treesContainer.forEach((item) => {
                item.setVisible(false)
            })
        })
        this.plantTab.on('pointerdown', () => {
            this.plantsContainer.forEach((item) => {
                item.setVisible(true)
            })
            this.wallDecorsContainer.forEach((item) => {
                item.setVisible(false)
            })
            this.backgroundsContainer.forEach((item) => {
                item.setVisible(false)
            })
            this.windowsLContainer.forEach((item) => {
                item.setVisible(false)
            })
            this.windowsRContainer.forEach((item) => {
                item.setVisible(false)
            })
            this.bedsContainer.forEach((item) => {
                item.setVisible(false)
            })
            this.platformsContainer.forEach((item) => {
                item.setVisible(false)
            })
            this.shelvesContainer.forEach((item) => {
                item.setVisible(false)
            })
            this.treesContainer.forEach((item) => {
                item.setVisible(false)
            })
        })
        this.furnitureTab.on('pointerdown', () => {
            this.plantsContainer.forEach((item) => {
                item.setVisible(false)
            })
            this.wallDecorsContainer.forEach((item) => {
                item.setVisible(false)
            })
            this.backgroundsContainer.forEach((item) => {
                item.setVisible(false)
            })
            this.windowsLContainer.forEach((item) => {
                item.setVisible(false)
            })
            this.windowsRContainer.forEach((item) => {
                item.setVisible(false)
            })
            this.bedsContainer.forEach((item) => {
                item.setVisible(true)
            })
            this.platformsContainer.forEach((item) => {
                item.setVisible(true)
            })
            this.shelvesContainer.forEach((item) => {
                item.setVisible(true)
            })
            this.treesContainer.forEach((item) => {
                item.setVisible(true)
            })
        })
    }

    purchaseItem(category, item) {
        if (this.gameState.coins < item.price) {
            console.log('not enough coins')
            return;
        }

        this.gameState.coins -= item.price;

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

    previewItem(itemId) {
        let bg = null;
        let img = null;
        bg = this.add.rectangle(this.game.config.width-200, this.game.config.height-150, 200, 200, this.colors.getHex('themeTertiary', 0.99))
        img = this.add.image(this.game.config.width-200, this.game.config.height-150, itemId).setScale(1);

        this.time.delayedCall(900, () => {
            console.log('remove preview')
            bg.destroy()
            img.destroy()
            // this.input.enabled = true;
        });
    }
}
