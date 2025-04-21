export default class StoreRenderer {
    constructor(scene, catalog, gameState, colors, soundManager) {
        this.scene        = scene;
        this.catalog      = catalog;
        this.gameState    = gameState;
        this.colors       = colors;
        this.soundManager = soundManager;

        this.defaultYOffset = 20;
        this.yOffset        = this.defaultYOffset;

        this.categoryConfig = {
            background:   { arrayName: 'backgroundsContainer',  x: 25,  y: 130 },
            windowL:      { arrayName: 'windowsLContainer',     x: 25,  y: 295 },
            windowR:      { arrayName: 'windowsRContainer',     x: 25,  y: 430 },

            picture:      { arrayName: 'wallDecorsContainer',   x: 25,  y: 130 },

            plant:        { arrayName: 'plantsContainer',       x: 25,  y: 130 },

            bed:          { arrayName: 'bedsContainer',         x: 25,  y: 130 },
            platform:     { arrayName: 'platformsContainer',    x: 25,  y: 325 },
            shelf:        { arrayName: 'shelvesContainer',      x: 350, y: 130 },
            tree:         { arrayName: 'treesContainer',        x: 25,  y: 400 },

            cat:          { arrayName: 'catsContainer',         x: 25,   y: 130 },

            actionPoints: { arrayName: 'actionPointsContainer', x: 0,   y: -1040 }
        };
    }

    resetYOffset() {
        this.yOffset = this.defaultYOffset;
    }

    renderCategory(type, containerArray) {
        const cfg = this.categoryConfig[type];
        if (!cfg) {
            console.warn(`No categoryConfig for "${type}"`);
            return;
        }

        // clear old items
        containerArray.forEach(c => c.destroy());
        containerArray.length = 0;
        this.resetYOffset();

        // re‑draw at cfg.x, cfg.y
        this.catalog[type].forEach(item => {
            const container = this.scene.add.container(cfg.x, cfg.y).setDepth(2);

            const unlocked = this.gameState.unlockedDecor[type].includes(item.id);
            const selected = this.gameState.selectedDecor[type].includes(item.id);

            // Name
            const nameTxt = this.scene.add.text(
                0, this.yOffset,
                `${item.name}:`,
                { fontFamily: 'SuperComic', fontSize: '17px', color: this.colors.get('themePrimaryDark') }
            ).setInteractive({ useHandCursor: true })
                .on('pointerover', () => this.scene.previewItem(item.id));

            // Cost
            const costTxt = this.scene.add.text(
                nameTxt.x + nameTxt.width + 20, this.yOffset,
                unlocked ? '' : item.price,
                { fontFamily: 'SuperComic', fontSize: '15px', color: this.colors.get('themePrimaryDark') }
            );

            const costIcon = this.scene.add.image(
                costTxt.x + costTxt.width + 15, costTxt.y + 10, 'coin'
            )
                .setScale(0.05)
                .setAlpha(unlocked ? 0 : 1);

            // Button
            const btnLabel = unlocked
                ? (selected ? 'Selected' : 'Select')
                : 'Unlock';

            const button = this.scene.add.text(
                costIcon.x + costIcon.displayWidth + 15, this.yOffset,
                btnLabel,
                { fontFamily: 'SuperComic', fontSize: '15px', color: this.colors.get('themePrimaryDark') }
            )
                .setInteractive({ useHandCursor: true })
                .on('pointerdown', () => {
                    this.soundManager.playClickSound();
                    if (unlocked) {
                        if (!selected) this.scene.selectDecor(type, item.id);
                    } else {
                        this.soundManager.playClickSoundAlt();
                        this.scene.purchaseItem(type, item);
                    }
                })
                .on('pointerover', () => button.setStyle({ color: this.colors.get('themePrimaryLight') }))
                .on('pointerout', () => button.setStyle({ color: this.colors.get('themePrimaryDark') }));

            container.add([nameTxt, costTxt, costIcon, button]);
            containerArray.push(container);
            this.yOffset += 30;
        });
    }

    renderStoreGameplaySection(type, containerArray, startX = 0, startY = 130) {
        containerArray.forEach(c => c && c.destroy());
        containerArray.length = 0;
        this.resetYOffset();

        this.catalog[type].forEach(item => {
            const container = this.scene.add.container(startX, startY).setDepth(2);
            const purchased = this.gameState.purchasedApPacks.includes(item.id);

            const nameTxt = this.scene.add.text(
                25, this.yOffset, `${item.name}:`, {
                    fontFamily: 'SuperComic', fontSize: '17px',
                    color: this.colors.get('themePrimaryDark')
                }
            )
                // .setInteractive({ useHandCursor: true })
                // .on('pointerover', () => this.scene.previewItem());


            const costTxt = this.scene.add.text(
                nameTxt.x + nameTxt.width + 20, this.yOffset,
                purchased ? '' : item.price, {
                    fontFamily: 'SuperComic', fontSize: '15px',
                    color: this.colors.get('themePrimaryDark')
                }
            );

            const costIcon = this.scene.add.image(
                costTxt.x + costTxt.width + 15, costTxt.y + 10, 'coin'
            )
                .setScale(0.05)
                .setAlpha(purchased ? 0 : 1);

            const btnTxt = purchased ? 'Already Bought' : 'Buy';
            const button = this.scene.add.text(
                costIcon.x + costIcon.displayWidth + 15,
                this.yOffset,
                btnTxt, {
                    fontFamily: 'SuperComic', fontSize: '15px',
                    color: this.colors.get('themePrimaryDark')
                }
            )
                .setInteractive({ useHandCursor: !purchased })
                .on('pointerdown', () => {
                    this.soundManager.playClickSoundAlt();
                    if (!purchased) this.scene.purchaseAP(item);
                })
                .on('pointerover', () => {
                    if (!purchased) button.setStyle({ color: this.colors.get('themePrimaryLight') });
                })
                .on('pointerout', () => {
                    if (!purchased) button.setStyle({ color: this.colors.get('themePrimaryDark') });
                });

            container.add([nameTxt, costTxt, costIcon, button]);
            this.yOffset += 30;
            containerArray.push(container);
        });
    }

    updateCategory(category) {
        const cfg = this.categoryConfig[category];
        const arr = this.scene[cfg.arrayName];
        // destroy old items
        arr.forEach(c => c.destroy());
        arr.length = 0;
        // reset offset
        this.resetYOffset();
        // re-render
        if (category === 'actionPoints') {
            this.renderStoreGameplaySection(category, arr, cfg.x, cfg.y);
        } else {
            this.renderCategory(category, arr, cfg.x, cfg.y);
        }
    }
}
