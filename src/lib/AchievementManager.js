import { ACHIEVEMENT_DEFS } from './achievements';

export default class AchievementManager {
    constructor(gameState, storage, emitter = null) {
        this.state = gameState;
        this.storage = storage;

        this.emitter = emitter || new Phaser.Events.EventEmitter();

        // Initialize counters if missing
        this.state.feedCount    = this.state.feedCount    || 0;
        this.state.waterCount   = this.state.waterCount   || 0;
        this.state.playCount    = this.state.playCount    || 0;
        this.state.unlockCount  = this.state.unlockCount  || 0;
        this.state.totalDays    = this.state.totalDays    || 0;

        this.state.unlockedAchievements = this.state.unlockedAchievements || [];
        this.state.claimedAchievements  = this.state.claimedAchievements  || [];
    }

    on(event, fn, ctx) {
        this.emitter.on(event, fn, ctx);
    }

    recordEvent(eventType, value = null) {
console.log('recorded event for achievs', eventType);
        switch (eventType) {
            case 'feed':     this.state.feedCount++;     break;
            case 'water':    this.state.waterCount++;    break;
            case 'play':     this.state.playCount++;     break;
            case 'unlock':   this.state.unlockCount++;   break;
            case 'login':
                this.state.totalDays++;
                // loginStreak is already managed elsewhere
                break;
            default: return;
        }
        this.checkAchievements();
    }

    // Call after any stat change if you want stat‑based achievements
    checkStat(key, value) {
        this.state[key] = value;
        this.checkAchievements();
    }

    checkAchievements() {
        ACHIEVEMENT_DEFS.forEach(def => {
            const alreadyUnlocked = this.state.unlockedAchievements.includes(def.id);
            if (alreadyUnlocked) return;

            let current;
            switch (def.type) {
                case 'count':     current = this.state[def.key];      break;
                case 'streak':    current = this.state.loginStreak;   break;
                case 'totalDays': current = this.state.totalDays;     break;
                case 'stat':      current = this.state.stats[def.key];break;
                default: return;
            }

            if (current >= def.threshold) {
                // 1) record achievement trigger
                this.state.unlockedAchievements.push(def.id);
                // 2) emit an event
                this.emitter.emit('achievementUnlocked', def);
                this.storage.save('gameState', this.state);
            }
        });
    }

    // getUnlockableAchievements() {
    //     // Returns all unlocked but not yet claimed
    //     return this.state.unlockedAchievements.filter(id =>
    //         !this.state.claimedAchievements.includes(id)
    //     ).map(id => ACHIEVEMENT_DEFS.find(def => def.id === id));
    // }

    claimAchievement(id) {
        if (this.state.claimedAchievements.includes(id)) return false;
        const def = ACHIEVEMENT_DEFS.find(d => d.id === id);
        if (!def || !this.state.unlockedAchievements.includes(id)) return false;

        this.state.claimedAchievements.push(id);
        this.state.coins += def.reward;

        this.storage.save('gameState', this.state);
        return true;
    }
}
