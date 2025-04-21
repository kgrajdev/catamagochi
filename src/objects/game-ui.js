// src/objects/GameUI.js

import { MAX_STATS, COLOR_THRESHOLDS } from "../lib/default-properties";

export default class GameUI {
    constructor(scene, gameState, colors) {
        this.scene     = scene;
        this.gameState = gameState;
        this.colors    = colors;

        this.statBars = {};
    }

    drawUI() {
        const barX       = 50;
        const barYStart  = 230;
        const barWidth   = 150;
        const barHeight  = 20;
        const spacing    = 50;

        // Draw each stat label + bar
        Object.keys(this.gameState.stats).forEach((stat, idx) => {
            const y = barYStart + idx * spacing;

            // Label
            this.scene.add.text(barX, y - 20, stat.toUpperCase(), {
                fontFamily: 'SuperComic',
                fontSize: '17px',
                color: this.colors.get('themePrimaryDark'),
            }).setDepth(2);

            // Bar (Graphics)
            const g = this.scene.add.graphics().setDepth(2);
            this.statBars[stat] = { graphics: g, x: barX, y, w: barWidth, h: barHeight };
            this._updateBar(stat, this.gameState.stats[stat]);
        });

        // AP text
        this.apText = this.scene.add.text(barX, barYStart + 230, `AP: ${this.gameState.AP}`, {
            fontFamily: 'SuperComic',
            fontSize: '19px',
            color: this.colors.get('themePrimaryDark')
        }).setDepth(2).setInteractive({ useHandCursor: true });

        // Coins text
        this.coinText = this.scene.add.text(this.apText.x, this.apText.y+this.apText.height+5, `Coins: ${this.gameState.coins}`, {
            fontFamily: 'SuperComic',
            fontSize: '19px',
            color: this.colors.get('themePrimaryDark')
        }).setDepth(2);
        // Coins Icon
        this.coinsIcon = this.scene.add.image(this.coinText.x+this.coinText.width+15, this.coinText.y+10, 'coin')
            .setScale(0.05)
            .setDepth(2);
    }

    // Called whenever a single stat changes
    updateStat(stat, value) {
        this._updateBar(stat, value);
    }

    // Call when AP changes
    updateAP() {
        this.apText.setText(`AP: ${this.gameState.AP}`);
    }

    // Call when coins change
    updateCoins() {
        this.coinText.setText(`Coins: ${this.gameState.coins}`);
    }

    // Internal: redraw one bar
    _updateBar(stat, value) {
        const { graphics, x, y, w, h } = this.statBars[stat];
        graphics.clear();

        // background
        graphics.fillStyle(0x333333);
        graphics.fillRect(x, y, w, h);

        // colored fill
        const color = this.colors.getHex(this._getColorKey(value));
        graphics.fillStyle(color);
        graphics.fillRect(x, y, (value / MAX_STATS[stat]) * w, h);
    }

    // Internal: map value→threshold key
    _getColorKey(val) {
        if (val >= COLOR_THRESHOLDS.green.min)  return "themeProgressBarGreen";
        if (val >= COLOR_THRESHOLDS.yellow.min) return "themeProgressBarYellow";
        if (val >= COLOR_THRESHOLDS.orange.min) return "themeProgressBarOrange";
        if (val >= COLOR_THRESHOLDS.red.min)    return "themeProgressBarRed";
        return "themeProgressBarBlack";
    }
}
