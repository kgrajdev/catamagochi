import { ACHIEVEMENT_DEFS } from './achievements';

export default class AchievementManager {
    constructor(gameState, storage, emitter = null) {
        this.gameState = gameState;
        this.storage = storage;

        this.emitter = emitter || new Phaser.Events.EventEmitter();

        this.gameState.unlockedAchievements = this.gameState.unlockedAchievements || [];
        this.gameState.claimedAchievements  = this.gameState.claimedAchievements  || [];
    }

    on(event, fn, ctx) {
        this.emitter.on(event, fn, ctx);
    }

    recordEvent(eventType) {

        switch (eventType) {
            case 'feed':     this.gameState.achievementCountTrackers.feedCount++;     break;
            case 'water':    this.gameState.achievementCountTrackers.waterCount++;    break;
            case 'play':     this.gameState.achievementCountTrackers.playCount++;     break;
            case 'unlock':   this.gameState.achievementCountTrackers.unlockCount++;   break;
            case 'login':    this.gameState.achievementCountTrackers.totalDays++;     break;
            default: return;
        }
        this.checkAchievements();
    }

    // Call after any stat change if you want stat‑based achievements
    checkStat(key, value) {
        this.gameState[key] = value;
        this.checkAchievements();
    }

    checkAchievements() {
        ACHIEVEMENT_DEFS.forEach(def => {
            const alreadyUnlocked = this.gameState.unlockedAchievements.includes(def.id);
            if (alreadyUnlocked) return;

            let current;
            switch (def.type) {
                case 'count':     current = this.gameState.achievementCountTrackers[def.key];      break;
                case 'streak':    current = this.gameState.achievementCountTrackers.loginStreak;   break;
                case 'totalDays': current = this.gameState.achievementCountTrackers.totalDays;     break;
                case 'stat':      current = this.gameState.stats[def.key];break;
                default: return;
            }

            if (current >= def.threshold) {
                // 1) record achievement trigger
                this.gameState.unlockedAchievements.push(def.id);
                // 2) emit an event
                this.emitter.emit('achievementUnlocked', def);
                this.storage.save(this.gameState)
            }
        });
    }

    claimAchievement(id) {
        if (this.gameState.claimedAchievements.includes(id)) return false;
        const def = ACHIEVEMENT_DEFS.find(d => d.id === id);
        if (!def || !this.gameState.unlockedAchievements.includes(id)) return false;

        this.gameState.claimedAchievements.push(id);
        this.gameState.coins += def.reward;

        this.storage.save(this.gameState)
        return true;
    }
}
