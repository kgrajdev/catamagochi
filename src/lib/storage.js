export default class Storage {
    constructor() {
        this.key = 'catamagochi_game_state';
        this.hostURL = window.location.hostname;
    }

    save(state) {
        const json = JSON.stringify(state);

        // Check if we are running on localhost
        const isDev = this.hostURL === 'localhost';

        const dataToStore = isDev ? json : btoa(json); // Only encode if not localhost
        localStorage.setItem(this.key, dataToStore);
    }

    load() {
        const rawData = localStorage.getItem(this.key);
        if (!rawData) return null;

        const isDev = window.location.hostname === 'localhost';

        try {
            const json = isDev ? rawData : atob(rawData); // Only decode if not localhost
            return JSON.parse(json);
        } catch (e) {
            console.error('Failed to decode or parse saved data:', e);
            return null;
        }
    }
}
