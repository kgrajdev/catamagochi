export default class ColorScheme {
    constructor() {
        this.colors = {
            themeLight: '#ffffff',
            themeDark: '#222222',

            themePrimary: '#6e5252',
            themePrimaryLight: '#ac8484',
            themePrimaryDark: '#493636',

            themeSecondary: '#383c2c',
            themeSecondaryLight: '#555c44',
            themeSecondaryDark: '#25291e',

            themeTertiary: '#49657d',
            themeTertiaryLight: '#5d7fa3',
            themeTertiaryDark: '#385060',

            themeError: '#910000',
            themeErrorDark: '#7e0000',
            themeErrorLight: '#b10000',
            themeSuccess: '#009718',
            themeSuccessDark: '#007a17',
            themeSuccessLight: '#00b11c',

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
