import ColorScheme from "./ColorScheme";

export default class TooltipManager {
    /**
     * Manages a single tooltip text that follows the cursor.
     * @param {Phaser.Scene} scene
     */
    constructor(scene) {
        this.scene = scene;
        this.colors = new ColorScheme();

        // Create the tooltip text (initially invisible)
        this.tooltip = this.scene.add.text(0, 0, '', {
            fontFamily: 'SuperComic',
            fontSize: '14px',
            color: this.colors.get('themePrimaryLight'),
            backgroundColor: this.colors.get('themePrimaryDark'),
            padding: { x: 8, y: 5 },
            align: 'center'
        })
            .setDepth(10000)        // above everything
            .setScrollFactor(0)     // fixed to camera
            .setAlpha(0);

        // Bind the pointer‑move handler so we can add/remove it cleanly
        this._onPointerMove = this._onPointerMove.bind(this);
    }

    /**
     * Show the tooltip with the given text, and start following the cursor.
     * @param {string} text
     */
    show(text = '') {
        this.tooltip.setText(text);
        this.tooltip.setAlpha(1);
        // Position immediately under the pointer
        const p = this.scene.input.activePointer;
        this._onPointerMove(p);
        // Start listening for pointer moves
        this.scene.input.on('pointermove', this._onPointerMove);
    }

    /**
     * Hide the tooltip and stop following the cursor.
     */
    hide() {
        this.tooltip.setAlpha(0);
        this.scene.input.off('pointermove', this._onPointerMove);
    }

    /**
     * Internal handler: move the tooltip to follow the pointer.
     * @param {Phaser.Input.Pointer} pointer
     */
    _onPointerMove(pointer) {
        // offset so it doesn’t overlap the cursor
        this.tooltip.x = pointer.x + 16;
        this.tooltip.y = pointer.y + 16;
    }
}
