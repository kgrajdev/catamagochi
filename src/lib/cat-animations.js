import {DECOR_CATALOG} from "./default-properties";

export class CatAnimations {
    constructor(scene) {
        this.scene = scene;

        this.createAnimations(this.scene);
    }

    createAnimations(scene) {

        const variants = DECOR_CATALOG.cat.map(item => item.id);
        variants.forEach(id => {
            const key    = `cat-tiles-${id}`;
            const suffix = id; // e.g. 'AllCatsGrey'

            scene.anims.create({
                key: `idle-${suffix}`,
                frames: scene.anims.generateFrameNumbers(key, { frames: [0,1,2,3,4,5] }),
                frameRate: 8, repeat: -1
            });

            scene.anims.create({
                key: `excited-${suffix}`,
                frames: scene.anims.generateFrameNumbers(key, { frames: [ 16, 17, 18 ] }),
                frameRate: 8,
                repeat: -1
            });

            scene.anims.create({
                key: `dead-${suffix}`,
                frames: scene.anims.generateFrameNumbers(key, { frames: [ 32 ] }),
                frameRate: 8,
                repeat: -1
            });

            scene.anims.create({
                key: `sleeping-${suffix}`,
                frames: scene.anims.generateFrameNumbers(key, { frames: [ 48, 49, 50, 51 ] }),
                frameRate: 2,
                repeat: -1
            });

            scene.anims.create({
                key: `happy-${suffix}`,
                frames: scene.anims.generateFrameNumbers(key, { frames: [ 64, 65, 66, 67, 68, 69, 70, 71, 72, 73 ] }),
                frameRate: 6,
                repeat: -1
            });

            scene.anims.create({
                key: `running-${suffix}`,
                frames: scene.anims.generateFrameNumbers(key, { frames: [ 80, 81,82,83,84,85 ] }),
                frameRate: 8,
                repeat: -1
            });

            scene.anims.create({
                key: `jump-${suffix}`,
                frames: scene.anims.generateFrameNumbers(key, { frames: [ 96,97,98,99,100,101,102,103,104,105,106,107 ] }),
                frameRate: 8,
                repeat: -1
            });

            scene.anims.create({
                key: `dance-${suffix}`,
                frames: scene.anims.generateFrameNumbers(key, { frames: [ 176,177,178, 179 ] }),
                frameRate: 8,
                repeat: -1
            });

            scene.anims.create({
                key: `chill-${suffix}`,
                frames: scene.anims.generateFrameNumbers(key, { frames: [ 192,193,194,195,196,197,198,199 ] }),
                frameRate: 8,
                repeat: -1
            });

            scene.anims.create({
                key: `surprised-${suffix}`,
                frames: scene.anims.generateFrameNumbers(key, { frames: [ 208,209 ] }),
                frameRate: 8,
                repeat: -1
            });

            scene.anims.create({
                key: `attack-${suffix}`,
                frames: scene.anims.generateFrameNumbers(key, { frames: [ 288, 289, 290, 291, 292, 293, 294 ] }),
                frameRate: 8,
                repeat: -1
            });


        });

    }
}