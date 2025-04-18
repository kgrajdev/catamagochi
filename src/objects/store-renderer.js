export default class StoreRenderer {
    constructor(scene, catalog, gameState, colors, soundManager) {
        this.scene = scene;
        this.catalog = catalog;
        this.gameState = gameState;
        this.colors = colors;
        this.yOffset = 20;
        this.soundManager = soundManager;
    }

    renderCategory(type, containerArray, startX = 25, startY = 120) {

        this.catalog[type].forEach((item) => {
            const container = this.scene.add.container(startX, startY, []).setDepth(2);
            const isUnlocked = this.gameState.unlockedDecor[type].includes(item.id);
            const isSelected = this.gameState.selectedDecor[type].includes(item.id);

            const itemName = this.scene.add.text(0, this.yOffset, `${item.name}:`, {
                fontFamily: 'SuperComic',
                fontSize: '17px',
                color: this.colors.get('themePrimaryDark'),
            }).setName('itemName').setInteractive({ useHandCursor: true });

            itemName.on('pointerover', () => {
                this.scene.previewItem(item.id);
            });

            container.add(itemName);

            const itemCost = this.scene.add.text(
                itemName.x + itemName.width + 20,
                this.yOffset,
                isUnlocked ? '' : item.price,
                {
                    fontFamily: 'SuperComic',
                    fontSize: '15px',
                    color: this.colors.get('themePrimaryDark'),
                }
            ).setName('itemCost');

            const itemCostIcon = this.scene.add.image(
                itemCost.x + itemCost.width + 15,
                itemCost.y + 10,
                'coin'
            )
                .setName('itemCostIcon')
                .setScale(0.05)
                .setAlpha(isUnlocked ? 0 : 1);

            const itemButton = this.scene.add.text(
                itemCostIcon.x + itemCostIcon.displayWidth + 15,
                this.yOffset,
                isUnlocked ? (isSelected ? 'Selected' : 'Select') : 'Unlock',
                {
                    fontFamily: 'SuperComic',
                    fontSize: '15px',
                    color: this.colors.get('themePrimaryDark'),
                }
            ).setName('itemButton')
                .setInteractive({ useHandCursor: true });

            itemButton.on('pointerdown', () => {
                if (isUnlocked) {
                    this.soundManager.playClickSound();
                    if (!isSelected) this.scene.selectDecor(type, item.id);
                } else {
                    this.soundManager.playClickSoundAlt();
                    this.scene.purchaseItem(type, item);
                }
            });
            itemButton.on('pointerover', () => {
                itemButton.setStyle({
                    color: this.colors.get('themePrimaryLight'),
                })
            });
            itemButton.on('pointerout', () => {
                itemButton.setStyle({
                    color: this.colors.get('themePrimaryDark'),
                })
            });

            container.add([itemCost, itemCostIcon, itemButton]);
            this.yOffset += 30;
            containerArray.push(container);
        });
    }

    resetYOffset() {
        this.yOffset = 0;
    }
}
