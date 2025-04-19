export const PLAYER_CONFIG = {
    catName: 'Meowlo',
    defaultX: 500,
    defaultY: 325,
}
export const DEFAULT_STATS = {
    food: 50,
    water: 50,
    tray: 100,
    happiness: 50,
    health: 100,
};
export const DECOR_CATALOG = {
    background: [
        { id: "Room1", name: "Background 1", price: 100 },
        { id: "Room2", name: "Background 2", price: 200 },
        { id: "Room3", name: "Background 3", price: 300 },
        { id: "Room4", name: "Background 4", price: 400 },
        { id: "Room5", name: "Background 5", price: 500 }
    ],
    windowL: [
        { id: "windowL1", name: "Window Left 1", price: 100 },
        { id: "windowL2", name: "Window Left 2", price: 200 },
        { id: "windowL3", name: "Window Left 3", price: 300 },
        { id: "windowL4", name: "Window Left 4", price: 400 }
    ],
    windowR: [
        { id: "windowR1", name: "Window Right 1", price: 100 },
        { id: "windowR2", name: "Window Right 2", price: 200 },
        { id: "windowR3", name: "Window Right 3", price: 300 },
        { id: "windowR4", name: "Window Right 4", price: 400 }
    ],
    bed: [
        { id: "bed1", name: "bed 1", price: 100 },
        { id: "bed2", name: "bed 2", price: 200 },
        { id: "bed3", name: "bed 3", price: 300 },
        { id: "bed4", name: "bed 4", price: 400 },
        { id: "bed5", name: "bed 5", price: 500 },
        { id: "bed6", name: "bed 6", price: 600 }
    ],
    picture: [
        { id: "picture1", name: "picture 1", price: 100 },
        { id: "picture2", name: "picture 2", price: 200 },
        { id: "picture3", name: "picture 3", price: 300 },
        { id: "picture4", name: "picture 4", price: 400 },
        { id: "picture5", name: "picture 5", price: 500 },
        { id: "picture6", name: "picture 6", price: 600 }
    ],
    plant: [
        { id: "plant1", name: "plant 1", price: 100 },
        { id: "plant2", name: "plant 2", price: 200 },
        { id: "plant3", name: "plant 3", price: 300 },
        { id: "plant4", name: "plant 4", price: 400 }
    ],
    platform: [
        { id: "platform1", name: "platform 1", price: 100 },
        { id: "platform2", name: "platform 2", price: 200 }
    ],
    shelf: [
        { id: "shelf1", name: "shelf 1", price: 100 },
        { id: "shelf2", name: "shelf 2", price: 200 },
        { id: "shelf3", name: "shelf 3", price: 300 },
        { id: "shelf4", name: "shelf 4", price: 400 },
        { id: "shelf5", name: "shelf 5", price: 500 }
    ],
    tree: [
        { id: "tree1", name: "tree 1", price: 100 },
        { id: "tree2", name: "tree 2", price: 200 },
        { id: "tree3", name: "tree 3", price: 300 }
    ],
    actionPoints: [
        { id: "apPack1", name: "10 Action Points Pack", points: 10, price: 100 },
        { id: "apPack2", name: "30 Action Points Pack", points: 30, price: 300 },
        { id: "apPack3", name: "50 Action Points Pack", points: 50, price: 500 }
    ]
};

export const MAX_STATS = {
    food: 100,
    water: 100,
    tray: 100,
    happiness: 100,
    health: 100
};

export const AP_COSTS = {
    fillFood: 3,
    fillWater: 3,
    cleanTray: 1,
    play: 3
};

// Constants for decay rates and thresholds (example values)
export const DECAY_RATES = {
    food: 0.02,    // per second or tick
    water: 0.02,
    tray: 0.01
};

export const DAILY_AWARDS = {
    dailyActionPoints: 10, // Constant daily Action Points award
    cashBase: 50, // Base cash reward
    cashIncrement: 5 // Increment per day of consecutive login
}
export const RANDOM_IDLE_BEHAVIORS = [
    { key: 'sleeping', duration: 10000 },   // static animation behavior, lasts 10 seconds
    { key: 'dance', duration: 3000 },
    { key: 'chill', duration: 5000 },
    { key: 'walk', duration: 3000 }          // special behavior that involves moving across the scene
];