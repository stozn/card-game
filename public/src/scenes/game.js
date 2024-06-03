import Render from "../utils/render.js";
import Card from "../gameobjects/card.js";
// import Player from "../gameobjects/player.js";

export default class Game extends Phaser.Scene {
    constructor() {
        super({
            key: 'Game'
        });
    }

    init({ username }) {
        this.username = username || '玩家' + Math.floor(Math.random() * 1000).toString();
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
        loadImages('disaster', 5);
        loadImages('gem', 4);
    }

    create() {
        let self = this;
        const socket = io();

        socket.on('connect', () => {
            console.log('Connected!');
        });
        socket.emit("login", self.username);
        self.add.image(864, 641, 'camp');
        let render = new Render(self);

        self.add.graphics().lineStyle(1, 0xff0000, 1).strokeRect(0, 0, 1600, 800);

        socket.on('dealCards', ({ type, id }) => {
            let card = new Card(self, { type: type, id: id });
            card.render(35, 27);
        })

        let { box, text } = render.drawTextBox("冒险翻开的卡", '#000', 28, 35, 27, 207, 295, 3, 0xa2a2a2);
        // text.setDepth(1);

        let { boxA, textA } = render.drawTextBox("陷阱A", '#000', 28, 264, 27, 119, 53, 3, 0xd43a3a);
        let { boxB, textB } = render.drawTextBox("陷阱B", '#000', 28, 264, 86, 119, 53, 3, 0xcecece);
        let { boxC, textC } = render.drawTextBox("陷阱C", '#000', 28, 264, 146, 119, 53, 3, 0xcecece);
        let { boxD, textD } = render.drawTextBox("陷阱D", '#000', 28, 264, 205, 119, 53, 3, 0xcecece);
        let { boxE, textE } = render.drawTextBox("陷阱E", '#000', 28, 264, 265, 119, 53, 3, 0xcecece);


        render.drawTextBox("公共区", '#000', 32, 35, 337, 348, 203, 3, 0xd1f3db);
        render.drawBox(435, 27, 574, 365, 7, 0xc5e8fb);
        render.drawTextBox("冒险日志", '#fff', 26, 449, 34, 546, 55, 7, 0x1a4baa);
        render.drawBox(435, 413, 252, 365, 7, 0xd9d9d9);
        render.drawBox(704, 413, 305, 65, 4.5, 0xd9d9d9);
        render.drawBox(1060, 27, 513, 747, 11, 0xd9d9d9);

        render.drawTextBox("继续冒险", '#000', 32, 36, 555, 348, 138, 13, 0xffea2b, null, null, 'pointerdown', () => {
            socket.emit("ready");
            console.log("冒险");
        });

        render.drawTextBox("溜了", '#fff', 32, 36, 705, 348, 71, 13, 0x2a2525, null, null, 'pointerdown', () => {
            socket.emit("back");
            console.log("溜了");
        });

        let message = '';
        let input = render.drawInput(1080, 695, 400, 63, 22, 'textarea').on('textchange', (input) => {
            message = input.text;
        });

        let sendMessage = () => {
            socket.emit("sendMessage", { user: self.username, msg: message });
            console.log("send " + self.username + ':' + message);
        }

        render.drawTextBox("发送", '#000', 28, 1490, 705, 70, 50, 13, 0x79df49, null, null, 'pointerdown', sendMessage);

        self.input.on('pointerdown', () => input.setBlur());

        input.on('keydown', function (input, e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        })

        let msgNum = 0;
        socket.on('sendMessage', ({ user, msg }) => {
            console.log(user + ': ' + msg);
            if (user === self.username) {
                input.text = '';
                message = '';
            }
            render.drawBox(1094, 47 + 93 * msgNum, 54, 53, 10, 0x373737);
            render.drawText(user, 1120, 113 + 93 * msgNum, '#000', 20).setFontStyle('bold');
            render.drawTextBox(msg, '#fff', 24, 1172, 47 + 93 * msgNum, 206, 53, 10, 0x4b4b4b);
            msgNum++;
        });

        let infos = [];
        socket.on('updatePlayers', (players) => {
            console.log(players);
            infos.forEach(info => info.destroy());
            for (let i = 0; i < players.length; i++) {
                let p = players[i];
                infos.push(render.drawBox(450, 430 + 83 * i, 68, 68, 14, 0x5e5e5e));
                infos.push(render.drawText(p.name + (p.state == '冒险中'?(p.ready ? ' ✔️' : ' ❔'):''),
                    600, 440 + 83 * i, '#000', 22).setFontStyle('bold'));
                if(p.id == socket.id){
                    infos.push(render.drawBox( 540, 460 + 83 * i, 120, 30, 8,
                        p.state == '冒险中' ? 0x30e257 : 0xdee230, 3, 0));
                    infos.push(render.drawText(`+${p.bag}`, 570, 475 + 83 * i, '#000', 20).setFontStyle('bold'));
                    infos.push(render.drawBox( 600, 462 + 83 * i, 56, 26, 8, 0));
                    infos.push(render.drawText(`${p.camp}`, 628, 475 + 83 * i, '#fff', 20).setFontStyle('bold'));
                }else{
                    let { box, text } = render.drawTextBox(p.state, '#000', 20, 540, 460 + 83 * i, 120, 30, 8,
                    p.state == '冒险中' ? 0x30e257 : 0xdee230, 3, 0);
                    infos.push(box);
                    infos.push(text);
                }
                
            }
        });

    }

    update() {

    }
}