import Phaser from 'phaser';
import ColorScheme from "./ColorScheme.js";
import Storage from "./storage";

export default class SaveExportImport {
    /**
     * @param {Phaser.Scene} scene - The scene that will display the modals.
     */
    constructor(scene) {
        this.scene = scene;
        this.colors = new ColorScheme();
        this.storage = new Storage();
    }

    showExportModal() {
        // Create a semi-transparent overlay covering the entire this.scene.
        const overlay = this.scene.add.rectangle(0, 0, this.scene.scale.width, this.scene.scale.height, 0x000000, 0.7)
            .setOrigin(0)
            .setInteractive()
            .setDepth(9999);

        // Retrieve the save data and encode it in Base64.
        const saveData = this.storage.load() || '';
        const encodedData = btoa(saveData);

        // Define modal dimensions.
        const modalWidth = this.scene.scale.width * 0.6;
        const modalHeight = this.scene.scale.height * 0.4;
        const modalX = (this.scene.scale.width - modalWidth) / 2;
        const modalY = (this.scene.scale.height - modalHeight) / 2;
        const modalBg = this.scene.add.rectangle(modalX, modalY, modalWidth, modalHeight, Number(this.colors.get('themePrimaryDark').replace('#', '0x')), 1)
            .setOrigin(0)
            .setDepth(999)
            .setStrokeStyle(2, Number(this.colors.get('themePrimary').replace('#', '0x')))

        // Create a text input field to display the encoded data.
        const inputElementWithDataStringLabel = this.scene.add.text(modalX + 20, modalY + 20,  'This is your unique save data. \nKeep it safe and have a backup somewhere.', {
            fontSize:  '19px',
            fontFamily: 'SuperComic',
            color: this.colors.get('themePrimaryLight'),
            wordWrap: { width: modalWidth - 40 }
        }).setDepth(999);
        const inputElementWithDataString = this.scene.add.dom(modalX + modalWidth / 2, modalY + modalHeight / 2, 'input', {
            width: (modalWidth - 50) + 'px',
            fontSize: '15px',
            padding: '10px'
        }).setDepth(999);
        inputElementWithDataString.node.value = encodedData;
        inputElementWithDataString.node.readOnly = true;

        // Create a "Copy to Clipboard" button.
        const copyButton = this.scene.add.text(modalX + modalWidth / 2, modalY + modalHeight - 50, 'Copy to Clipboard', {
            fontFamily: 'SuperComic',
            fontSize: '20px',
            color: this.colors.get('themePrimaryLight'),
            backgroundColor: this.colors.get('themePrimaryDark'),
            padding: { left: 12, right: 12, top: 11, bottom: 10 }
        }).setOrigin(0.5)
            .setDepth(999)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(encodedData)
                        .then(() => console.log('Copied to clipboard'))
                        .catch(err => console.error('Copy failed', err));
                } else {
                    // Fallback for older browsers.
                    const tempInput = document.createElement('input');
                    tempInput.value = encodedData;
                    document.body.appendChild(tempInput);
                    tempInput.select();
                    document.execCommand('copy');
                    document.body.removeChild(tempInput);
                }
                copyButton.setStyle({
                    color: this.colors.get('themePrimaryLight'),
                    backgroundColor: this.colors.get('themePrimaryDark'),
                })
                // display confirmation of copying
            })
            .on('pointerover', () => {
                copyButton.setStyle({
                    color: this.colors.get('themePrimaryLight'),
                    backgroundColor: this.colors.get('themePrimary'),
                })
            })
            .on('pointerup', () => {
                copyButton.setStyle({
                    color: this.colors.get('themePrimaryLight'),
                    backgroundColor: this.colors.get('themePrimaryDark'),
                })
            })
            .on('pointerout', () => {
                copyButton.setStyle({
                    color: this.colors.get('themePrimaryLight'),
                    backgroundColor: this.colors.get('themePrimaryDark'),
                })
            })

        // Create a close button.
        const closeButton = this.scene.add.text(modalX + modalWidth -10, modalY + 10, 'X', {
            fontFamily: 'SuperComic',
            fontSize: '17px',
            color: this.colors.get('themePrimaryLight'),
            padding: { left: 5, right: 5, top: 5, bottom: 5 }
        })
            .setOrigin(1,0)
            .setInteractive({ useHandCursor: true })
            .setDepth(999)
            .on('pointerdown', () => {
                overlay.destroy();
                modalBg.destroy();
                inputElementWithDataStringLabel.destroy();
                inputElementWithDataString.destroy();
                copyButton.destroy();
                closeButton.destroy();
            })
            .on('pointerover', () => {
                closeButton.setStyle({
                    color: this.colors.get('themePrimary'),
                });
            })
            .on('pointerout', () => {
                closeButton.setStyle({
                    color: this.colors.get('themePrimaryLight'),
                });
            })

        // Optionally group modal elements in a container.
        this.exportModal = this.scene.add.container(0, 0, [overlay, modalBg, inputElementWithDataStringLabel, copyButton, closeButton]).setDepth(9999);
    }

    showImportModal() {
        // Create a semi-transparent overlay covering the entire this.scene.
        const overlay = this.scene.add.rectangle(0, 0, this.scene.scale.width, this.scene.scale.height, 0x000000, 0.7)
            .setOrigin(0)
            .setInteractive()
            .setDepth(9999);

        // Define modal dimensions.
        const modalWidth = this.scene.scale.width * 0.6;
        const modalHeight = this.scene.scale.height * 0.4;
        const modalX = (this.scene.scale.width - modalWidth) / 2;
        const modalY = (this.scene.scale.height - modalHeight) / 2;
        const modalBg = this.scene.add.rectangle(modalX, modalY, modalWidth, modalHeight, Number(this.colors.get('themePrimaryDark').replace('#', '0x')), 1)
            .setOrigin(0)
            .setDepth(999)
            .setStrokeStyle(2, Number(this.colors.get('themePrimary').replace('#', '0x')))

        const inputElementWithDataStringLabel = this.scene.add.text(modalX + 20, modalY + 20,  'Paste your save data below:', {
            fontSize:  '19px',
            fontFamily: 'SuperComic',
            color: this.colors.get('themePrimaryLight'),
            wordWrap: { width: modalWidth - 40 }
        }).setDepth(999);

        // Create a DOM element for text input.
        const inputElement = this.scene.add.dom(modalX + modalWidth / 2, modalY + modalHeight / 2, 'input', {
            width: (modalWidth - 40) + 'px',
            fontSize: '16px',
            padding: '10px'
        }).setDepth(1001);

        const importButton = this.scene.add.text(modalX + modalWidth / 2, modalY + modalHeight - 60, 'Import Save Data', {
            fontFamily: 'SuperComic',
            fontSize: '20px',
            color: this.colors.get('themePrimaryLight'),
            backgroundColor: this.colors.get('themePrimaryDark'),
            padding: { left: 12, right: 12, top: 11, bottom: 10 }
        }).setOrigin(0.5)
            .setDepth(999)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                const encodedData = inputElement.node.value.trim();
                if (encodedData.length >= 1) {
                    try {
                        const decodedData = atob(encodedData);
                        this.storage.save(decodedData)
                        console.log('Save imported successfully');
                        overlay.destroy();
                        modalBg.destroy();
                        inputElementWithDataStringLabel.destroy();
                        inputElement.destroy();
                        importButton.destroy();
                        closeButton.destroy();
                        this.scene.scene.start('BootScene');
                    } catch (e) {
                        console.error('Invalid save data');
                    }
                    importButton.setStyle({
                        color: this.colors.get('themePrimaryLight'),
                        backgroundColor: this.colors.get('themePrimaryDark')
                    })
                }
            })
            .on('pointerover', () => {
                importButton.setStyle({
                    color: this.colors.get('themePrimaryLight'),
                    backgroundColor: this.colors.get('themePrimary'),
                })
            })
            .on('pointerup', () => {
                importButton.setStyle({
                    color: this.colors.get('themePrimaryLight'),
                    backgroundColor: this.colors.get('themePrimaryDark'),
                })
            })
            .on('pointerout', () => {
                importButton.setStyle({
                    color: this.colors.get('themePrimaryLight'),
                    backgroundColor: this.colors.get('themePrimaryDark'),
                })
            })

        // Create a close button.
        const closeButton = this.scene.add.text(modalX + modalWidth -10, modalY + 10, 'X', {
            fontFamily: 'SuperComic',
            fontSize: '17px',
            color: this.colors.get('themePrimaryLight'),
            padding: { left: 5, right: 5, top: 5, bottom: 5 }
        })
            .setOrigin(1,0)
            .setInteractive({ useHandCursor: true })
            .setDepth(999)
            .on('pointerdown', () => {
                overlay.destroy();
                modalBg.destroy();
                inputElementWithDataStringLabel.destroy();
                inputElement.destroy();
                importButton.destroy();
                closeButton.destroy();
            })
            .on('pointerover', () => {
                closeButton.setStyle({
                    color: this.colors.get('themePrimary'),
                });
            })
            .on('pointerout', () => {
                closeButton.setStyle({
                    color: this.colors.get('themePrimaryLight'),
                });
            })

        this.importModal = this.scene.add.container(0, 0, [overlay, modalBg, inputElementWithDataStringLabel, inputElement, importButton, closeButton]).setDepth(9999);
    }
}
