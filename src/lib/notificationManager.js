import ColorScheme from "./ColorScheme";

export default class NotificationManager  {
    constructor(scene) {
        this.scene = scene;
        this.colors = new ColorScheme();
    }

    showNotification(messageTitle, messageContent, displayTime = 500, align = 'center') {
        const notificationMessage = this.scene.add.text(this.scene.game.config.width/2, this.scene.game.config.height-75,
            `${messageTitle}
             \n${messageContent}`, {
                fontFamily: 'SuperComic',
                fontSize: '14px',
                color: this.colors.get('themePrimaryLight'),
                align: align,
                backgroundColor: this.colors.get('themePrimaryDark'),
                padding: { x: 15, y: 7 }
            })
            .setOrigin(0.5)
            .setDepth(1000);

        // fade out & destroy after a while
        this.scene.tweens.add({
            targets: notificationMessage,
            alpha: { from: 1, to: 0 },
            ease: 'Linear',
            duration: 500,
            delay: displayTime,
            onComplete: () => notificationMessage.destroy()
        });
    }
}
