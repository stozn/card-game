import Card from './card.js';
import Dealer from "./dealer.js";
import Zone from './zone.js';

export default class Game extends Phaser.Scene {
    constructor() {
        super({
            key: 'Game'
        });
    }

    preload() {
        this.load.image('cyanCardFront', 'assets/CyanCardFront.png');
        this.load.image('cyanCardBack', 'assets/CyanCardBack.png');
        this.load.image('magentaCardFront', 'assets/MagentaCardFront.png');
        this.load.image('magentaCardBack', 'assets/MagentaCardBack.png');
    }

    create() {
        this.isPlayerA = false;
        this.opponentCards = [];

        this.zone = new Zone(this);
        this.dropZone = this.zone.renderZone();
        this.outline = this.zone.renderOutline(this.dropZone);

        this.dealer = new Dealer(this);

        let self = this;

        this.socket = io();

        this.socket.on('connect', function () {
            console.log('Connected!');
        });

        this.socket.on('isPlayerA', function () {
            self.isPlayerA = true;
        })

        this.socket.on('dealCards', function () {
            self.dealer.dealCards();
            self.dealText.disableInteractive();
        })

        this.socket.on('cardPlayed', function (card, isPlayerA) {
            if (isPlayerA !== self.isPlayerA) {
                let sprite = card.textureKey;
                self.opponentCards.shift().destroy();
                self.dropZone.data.list.cards++;
                let playedCard = new Card(self);
                playedCard.render(((self.dropZone.x - 350) + (self.dropZone.data.list.cards * 50)), (self.dropZone.y), sprite).disableInteractive();
            }
        })

        this.dealText = this.add.text(75, 350, ['DEAL CARDS']).setFontSize(18).setFontFamily('Trebuchet MS').setColor('#00ffff').setInteractive();

        this.dealText.on('pointerdown', function () {
            self.socket.emit("dealCards");
        })

        this.dealText.on('pointerover', function () {
            self.dealText.setColor('#ff69b4');
        })

        this.dealText.on('pointerout', function () {
            self.dealText.setColor('#00ffff');
        })

        this.input.on('drag', function (pointer, card, dragX, dragY) {
            card.x = dragX;
            card.y = dragY;
        })

        this.input.on('dragstart', function (pointer, card) {
            card.setTint(0xff69b4);
            self.children.bringToTop(card);
        })

        this.input.on('dragend', function (pointer, card, dropped) {
            card.setTint();
            if (!dropped) {
                card.x = card.input.dragStartX;
                card.y = card.input.dragStartY;
            }
        })

        this.input.on('drop', function (pointer, card, dropZone) {
            dropZone.data.list.cards++;
            card.x = (dropZone.x - 350) + (dropZone.data.list.cards * 50);
            card.y = dropZone.y;
            card.disableInteractive();
            self.socket.emit('cardPlayed', card, self.isPlayerA);
        })

        this.downCard = null;
        this.input.on('gameobjectdown', function (pointer, card) {
            self.downCard = card;
            setTimeout(() => {
                if(self.downCard) {
                    self.downCard.setScale(0.6, 0.6);
                }
            }, 800)
        })

        this.input.on('gameobjectup', function () {
            self.downCard.setScale(0.3, 0.3);
            self.downCard = null;
        })
    }

    update() {

    }
}