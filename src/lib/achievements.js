export const ACHIEVEMENT_DEFS = [
    // Feeding, watering, playing milestones
    { id: 'feed_5',    desc: 'Feed your cat 5 times',          type: 'count', key: 'feedCount',     threshold: 1,  reward: 10 },
    { id: 'feed_10',    desc: 'Feed your cat 10 times',          type: 'count', key: 'feedCount',     threshold: 10,  reward: 20 },
    { id: 'water_5',   desc: 'Give water 5 times',             type: 'count', key: 'waterCount',    threshold: 5,  reward: 10 },
    { id: 'water_10',   desc: 'Give water 10 times',             type: 'count', key: 'waterCount',    threshold: 10,  reward: 20 },
    { id: 'play_5',     desc: 'Play with your cat 5 times',      type: 'count', key: 'playCount',     threshold: 5,   reward: 10 },
    { id: 'play_10',     desc: 'Play with your cat 10 times',      type: 'count', key: 'playCount',     threshold: 10,   reward: 20 },

    // Shop unlock milestones
    { id: 'unlock_5',   desc: 'Unlock 5 decor items',            type: 'count', key: 'unlockCount',   threshold: 5,   reward: 50 },
    { id: 'unlock_10',   desc: 'Unlock 10 decor items',            type: 'count', key: 'unlockCount',   threshold: 10,   reward: 100 },

    // Login streaks and totals
    { id: 'streak_3',   desc: '3‑Day Login Streak',               type: 'streak',    key: 'loginStreak',   threshold: 3,   reward: 30 },
    { id: 'streak_7',   desc: '7‑Day Login Streak',               type: 'streak',    key: 'loginStreak',   threshold: 7,   reward: 70 },
    { id: 'total_14',    desc: 'Play 14 days in total',            type: 'totalDays', key: 'totalDays',     threshold: 14,   reward: 100 },
    { id: 'total_21',    desc: 'Play 21 days in total',            type: 'totalDays', key: 'totalDays',     threshold: 21,   reward: 250 },

    // Max‑stat achievements
    { id: 'happy_100',  desc: 'Reach 100% happiness',             type: 'stat', key: 'happiness',      threshold: 100, reward: 5 },
    { id: 'food_100',   desc: 'Reach 100% food',                  type: 'stat', key: 'food',           threshold: 100, reward: 5 },
];
