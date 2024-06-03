import socket from "../utils/socket.js";
import Render from "../utils/render.js";
import Dealer from "../gameobjects/dealer.js";
import Player from "../gameobjects/player.js";

export default class Game extends Phaser.Scene {
    constructor() {
        super({
            key: 'Game'
        });
    }

    init({username}) {
        this.username = username;
        console.log('你ui ' + username);
    }

    preload() {
        let self = this;
        self.load.image('camp', 'assets/camp.jpg');
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
        self.add.image(864, 641, 'camp');
        self.dealer = new Dealer(self);
        let render = new Render(self);
        self.players = [];

        self.add.graphics().lineStyle(1, 0xff0000, 1).strokeRect(0, 0, 1600, 800);

        socket.on('addPlayer', (username) => {
            console.log('新玩家加入' + username);
            let player = new Player(self, username);
            self.players.push(player);
            // player.render(100, 100);
        });


        socket.on('dealCards', () => {
            console.log('dealCards');
            self.dealer.dealCards();
            // self.dealText.disableInteractive();
        })

        let { box, text } = render.drawTextBox("冒险翻开的卡", '#000', 32, 35, 27, 207, 295, 3, 0xa2a2a2);
        // text.setDepth(1);

        render.drawTextBox("陷阱A", '#000', 32, 264, 27, 119, 53, 3, 0xd43a3a);
        render.drawTextBox("陷阱B", '#000', 32, 264, 86, 119, 53, 3, 0xcececce);
        render.drawTextBox("陷阱C", '#000', 32, 264, 146, 119, 53, 3, 0xcececce);
        render.drawTextBox("陷阱D", '#000', 32, 264, 205, 119, 53, 3, 0xd43a3a);
        render.drawTextBox("陷阱E", '#000', 32, 264, 265, 119, 53, 3, 0xcececce);

        render.drawTextBox("公共区", '#000', 32, 35, 337, 348, 203, 3, 0xd1f3db);
        render.drawBox(435, 27, 574, 365, 7, 0xc5e8fb);
        render.drawTextBox("冒险日志", '#fff', 26, 449, 34, 546, 55, 7, 0x1a4baa);
        render.drawBox(435, 413, 252, 365, 7, 0xd9d9d9);
        render.drawBox(704, 413, 305, 65, 4.5, 0xd9d9d9);
        render.drawBox(1060, 27, 513, 747, 11, 0xd9d9d9);

        render.drawTextBox("继续冒险", '#000', 32, 36, 555, 348, 138, 13, 0xffea2b, 'pointerdown', () => {
            socket.emit("dealCards");
            console.log("dksklfsd");
        });

        render.drawTextBox("溜了", '#fff', 32, 36, 705, 348, 71, 13, 0x2a2525, 'pointerdown', () => {
            socket.emit("back");
        });

        let message = '';
        let input = render.drawInput(1094, 632, 446, 125, 28, 'textarea').on('textchange', (input) => {
            message = input.text;
        });

        self.input.on('pointerdown', function () {
            input.setBlur();
        })

        input.on('keydown', function (input, e) {
            if (e.key === 'Enter') {
                input.setBlur();
                socket.emit("sendMessage", { user: self.username, msg: message });
                console.log("send " + self.username + ':' + message);
                input.text = '';
                message = '';
            }
        })

        let msgNum = 0;
        socket.on('sendMessage', (info) => {
            console.log(info);
            let user = info.user;
            let msg = info.msg;
            render.drawBox(1094, 47 + 93 * msgNum, 54, 53, 10, 0x373737);
            render.drawText(user, 1120, 113 + 93 * msgNum, '#000', 20).setFontStyle('bold');
            render.drawTextBox(msg, '#fff', 24, 1172, 47 + 93 * msgNum, 206, 53, 10, 0x4b4b4b);
            msgNum++;
        });

    }

    update() {

    }
}