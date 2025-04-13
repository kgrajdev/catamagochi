export default class Storage {
    constructor() {
        this.key = 'catamagochi_game_state';
        this.hostURL = window.location.href;
    }

    save(state) {
        localStorage.setItem(this.key, JSON.stringify(state));
    }

    load() {
        const state = localStorage.getItem(this.key);
        return state ? JSON.parse(state) : null;
    }
}
