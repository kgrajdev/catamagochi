import Phaser from 'phaser';
import { ACHIEVEMENT_DEFS } from './achievements';
import Storage from "./storage";

export default class AchievementManager {
    constructor(gameState, storage, emitter = null) {
        this.gameState = gameState;
        this.storage = new Storage();

        this.emitter = emitter || new Phaser.Events.EventEmitter();

        // Ensure trackers exist
        this.gameState.achievementCountTrackers = this.gameState.achievementCountTrackers || {
            feedCount: 0,
            waterCount: 0,
            playCount: 0,
            unlockCount: 0,
            loginStreak: 0,
            totalDays: 0
        };

        this.gameState.unlockedAchievements = this.gameState.unlockedAchievements || [];
        this.gameState.claimedAchievements  = this.gameState.claimedAchievements  || [];
    }

    on(event, fn, ctx) {
        this.emitter.on(event, fn, ctx);
    }

    recordEvent(eventType) {
        const t = this.gameState.achievementCountTrackers;
        switch (eventType) {
            case 'feed':   t.feedCount++;   break;
            case 'water':  t.waterCount++;  break;
            case 'play':   t.playCount++;   break;
            case 'unlock': t.unlockCount++; break;
            case 'login':  t.totalDays++;     break;
            default: return;
        }
        this.storage.save(this.gameState);
        this.checkAchievements();
    }

    checkAchievements() {
        ACHIEVEMENT_DEFS.forEach(def => {
            if (this.gameState.unlockedAchievements.includes(def.id)) return;

            let current;
            switch (def.type) {
                case 'count':     current = this.gameState.achievementCountTrackers[def.key];    break;
                case 'streak':    current = this.gameState.achievementCountTrackers.loginStreak; break;
                case 'totalDays': current = this.gameState.achievementCountTrackers.totalDays;   break;
                case 'stat':      current = this.gameState.stats[def.key];                       break;
                default: return;
            }

            if (current >= def.threshold) {
                // 1) record achievement trigger
                this.gameState.unlockedAchievements.push(def.id);
                // 2) save
                this.storage.save(this.gameState);

                // 3) emit an event
                this.emitter.emit('achievementUnlocked', def);
            }
        });
    }

    claimAchievement(id) {
        if (this.gameState.claimedAchievements.includes(id)) return false;
        const def = ACHIEVEMENT_DEFS.find(d => d.id === id);
        if (!def || !this.gameState.unlockedAchievements.includes(id)) return false;

        this.gameState.claimedAchievements.push(id);
        this.gameState.coins += def.reward;

        this.storage.save(this.gameState);

        return true;
    }
}
