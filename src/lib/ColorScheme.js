export default class ColorScheme {
    constructor() {
        this.colors = {
            themeLight: '#ffffff',
            themeDark: '#222222',

            themePrimary: '#f3cc65',
            themePrimaryLight: '#fce8b5',
            themePrimaryDark: '#c57c29',

            themeSecondary: '#4494af',
            themeSecondaryLight: '#7ec4df',
            themeSecondaryDark: '#296d83',

            themeTertiary: '#61504e',
            themeTertiaryLight: '#745b58',
            themeTertiaryDark: '#443836',

            themeError: '#910000',
            themeSuccess: '#009718',

            themeProgressBarGreen: '#63bf00',
            themeProgressBarYellow: '#bfaf00',
            themeProgressBarOrange: '#bf4900',
            themeProgressBarRed: '#bf0000',
            themeProgressBarBlack: '#200000',
        };
    }

    /**
     * Get the color value with optional opacity
     * @param {string} key - The color key
     * @param {number} [opacity=1] - Optional opacity (0 to 1)
     * @returns {string} - Color in hex or rgba format
     */
    get(key, opacity = 1) {
        if (!this.colors.hasOwnProperty(key)) {
            console.warn(`Color key "${key}" not found.`);
            return `rgba(203, 0, 255, ${opacity})`; // Default fallback with opacity
        }

        const color = this.colors[key];

        if (opacity >= 1) return color; // Return hex if fully opaque

        // Convert hex to RGB and apply opacity
        const { r, g, b } = this.hexToRgb(color);
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }

    /**
     * Get the hex value as a number with optional opacity
     * @param {string} key - The color key
     * @param {number} [opacity=1] - Optional opacity (0 to 1, affects alpha channel)
     * @returns {number} - Hex color as a number
     */
    getHex(key, opacity = 1) {
        if (!this.colors.hasOwnProperty(key)) {
            return 0xCB00FF; // Fallback color
        }

        const { r, g, b } = this.hexToRgb(this.colors[key]);
        const a = Math.round(opacity * 255);

        return (a << 24) | (r << 16) | (g << 8) | b;
    }

    /**
     * Convert hex color to RGB object
     * @param {string} hex - The hex color value
     * @returns {{r: number, g: number, b: number}}
     */
    hexToRgb(hex) {
        let hexValue = hex.replace('#', '');
        if (hexValue.length === 3) {
            hexValue = hexValue.split('').map(c => c + c).join('');
        }
        const num = parseInt(hexValue, 16);
        return {
            r: (num >> 16) & 255,
            g: (num >> 8) & 255,
            b: num & 255
        };
    }
}
