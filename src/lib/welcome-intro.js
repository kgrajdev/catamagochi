import ColorScheme from "./ColorScheme";
import Storage     from "./storage";

export default class WelcomeIntro {
    constructor(scene) {
        this.scene     = scene;
        this.colors    = scene.colors;
        this.storage   = scene.storage;
        this.gameState = scene.gameState;

        this.showWelcomeMessage(scene)
    }


    showWelcomeMessage(scene) {
        const colors   = new ColorScheme();
        const storage  = new Storage();
        const gameState = storage.load();

        const welcomeContainer = scene.add.container(
            scene.game.config.width / 2,
            scene.game.config.height / 2
        ).setDepth(9999);

        const bg = scene.add
            .rectangle(
                0, 0,
                scene.game.config.width - 180,
                scene.game.config.height - 145,
                colors.getHex("themePrimaryDark", 0.5)
            )
            .setInteractive();

        const title = scene.add
            .text(0, -160, "Welcome to Catamagochi", {
                fontFamily: "SuperComic",
                fontSize: "22px",
                color: colors.get("themeLight"),
                align: "center",
            })
            .setOrigin(0.5);

        const message = scene.add
            .text(
                0,
                title.y + title.height + 100,
                `Getting Started:\n\n- You have a fixed number of Action Points (AP) per day.\nUse them wisely to interact with your companion.\n\n- Every day you play you will be awarded new AP and Coins.\nThe longer the streak the bigger the bonus.\n\n- Spend coins in the Store to unlock decor & new kitty skins.`,
                {
                    fontFamily: "SuperComic",
                    fontSize: "16px",
                    color: colors.get("themeLight"),
                    align: "left",
                    wordWrap: { width: scene.game.config.width - 220 }
                }
            )
            .setOrigin(0.5);

        const button = scene.add
            .text(0, message.y + message.height + 30, "OK", {
                fontFamily: "SuperComic",
                fontSize: "20px",
                color: colors.get("themeLight"),
                align: "center",
            })
            .setInteractive({ useHandCursor: true })
            .on("pointerdown", () => {
                this.gameState.gameSettings.welcomeMessageShown = true;
                this.storage.save(this.gameState);
                welcomeContainer.destroy();
            })
            .setOrigin(0.5);

        welcomeContainer.add([bg, title, message, button]);
    }
}
