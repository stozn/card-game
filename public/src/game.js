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

        let self = this;
        function loadImages(dir, n) {
            for (let i = 1; i <= n; i++)
                self.load.image(`${dir}-${i}`, `assets/${dir}/${i}.jpg`);
        }
        loadImages('artifact', 6);
        loadImages('disaster', 6);
        loadImages('gem', 4);
    }

    create() {
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

        this.dealText = this.add.text(75, 350, ['发牌']);
        this.dealText.setFontSize(18).setColor('#00ffff').setInteractive();

        this.dealText.on('pointerdown', function () {
            self.socket.emit("dealCards");
        })

        this.dealText.on('pointerover', function () {
            self.dealText.setColor('#ff69b4');
        })

        this.dealText.on('pointerout', function () {
            self.dealText.setColor('#00ffff');
        })

    }

    update() {

    }
}