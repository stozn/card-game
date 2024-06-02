import Card from './card.js';
import Dealer from "./dealer.js";

export default class Game extends Phaser.Scene {
    constructor() {
        super({
            key: 'Game'
        });
    }

    preload() {
        let self = this;
        self.load.image('camp', 'assets/camp.png');
        function loadImages(dir, n) {
            for (let i = 1; i <= n; i++)
                self.load.image(`${dir}-${i}`, `assets/${dir}/${i}.jpg`);
        }
        loadImages('artifact', 6);
        loadImages('disaster', 6);
        loadImages('gem', 4);
    }

    create() {
        let self = this;
        this.add.image(300, 540, 'camp');
        this.dealer = new Dealer(this);
        this.socket = io();

        this.socket.on('connect', () => {
            console.log('Connected!');
        });

        this.socket.on('addPlayer', (player) => {
            console.log('A player joined: ' + player);
        });


        this.socket.on('dealCards', () => {
            self.dealer.dealCards();
            // self.dealText.disableInteractive();
        })

        self.box = this.add.graphics();
        self.box.fillStyle(0xf0f040, 1);
        self.box.strokeRoundedRect(720, 800, 160, 60);
        self.box.fillRoundedRect(720, 800, 160, 60);

        self.text = this.add.text(740, 810, "继续探险", { fontFamily: 'SimHei', fontSize: '32px', fill: '#000' });
        self.text.setDepth(1);
        self.text.setInteractive();

        self.text.on('pointerdown', () => {
            self.socket.emit("dealCards");
        });
    }

    update() {

    }
}