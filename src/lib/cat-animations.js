export class CatAnimations {
    constructor(scene) {
        this.scene = scene;

        this.createAnimations(this.scene);
    }

    createAnimations(scene) {

        scene.anims.create({
            key: 'idle',
            frames: scene.anims.generateFrameNumbers('cat-tiles-master', { frames: [ 0, 1, 2, 3, 4 , 5 ] }),
            frameRate: 8,
            repeat: -1
        });

        scene.anims.create({
            key: 'excited',
            frames: scene.anims.generateFrameNumbers('cat-tiles-master', { frames: [ 16, 17, 18 ] }),
            frameRate: 8,
            repeat: -1
        });

        scene.anims.create({
            key: 'dead',
            frames: scene.anims.generateFrameNumbers('cat-tiles-master', { frames: [ 32 ] }),
            frameRate: 8,
            repeat: -1
        });

        scene.anims.create({
            key: 'sleeping',
            frames: scene.anims.generateFrameNumbers('cat-tiles-master', { frames: [ 48, 49, 50, 51 ] }),
            frameRate: 2,
            repeat: -1
        });

        scene.anims.create({
            key: 'happy',
            frames: scene.anims.generateFrameNumbers('cat-tiles-master', { frames: [ 64, 65, 66, 67, 68, 69, 70, 71, 72, 73 ] }),
            frameRate: 6,
            repeat: -1
        });

        scene.anims.create({
            key: 'running',
            frames: scene.anims.generateFrameNumbers('cat-tiles-master', { frames: [ 80, 81,82,83,84,85 ] }),
            frameRate: 8,
            repeat: -1
        });

        scene.anims.create({
            key: 'jump',
            frames: scene.anims.generateFrameNumbers('cat-tiles-master', { frames: [ 96,97,98,99,100,101,102,103,104,105,106,107 ] }),
            frameRate: 8,
            repeat: -1
        });

        scene.anims.create({
            key: 'dance',
            frames: scene.anims.generateFrameNumbers('cat-tiles-master', { frames: [ 176,177,178, 179 ] }),
            frameRate: 8,
            repeat: -1
        });

        scene.anims.create({
            key: 'chill',
            frames: scene.anims.generateFrameNumbers('cat-tiles-master', { frames: [ 192,193,194,195,196,197,198,199 ] }),
            frameRate: 8,
            repeat: -1
        });

        scene.anims.create({
            key: 'surprised',
            frames: scene.anims.generateFrameNumbers('cat-tiles-master', { frames: [ 208,209 ] }),
            frameRate: 8,
            repeat: -1
        });

        scene.anims.create({
            key: 'attack',
            frames: scene.anims.generateFrameNumbers('cat-tiles-master', { frames: [ 288, 289, 290, 291, 292, 293, 294 ] }),
            frameRate: 8,
            repeat: -1
        });

    }
}