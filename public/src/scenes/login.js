import socket from "../utils/socket.js";
import Render from "../utils/render.js";

export default class Login extends Phaser.Scene {
    constructor() {
        super({
            key: 'Login'
        });
    }

    preload() {
        let self = this;
        self.load.image('camp', 'assets/camp.jpg');
        self.load.plugin('rexinputtextplugin', '../../lib/rexinputtextplugin.min.js', true);
    }

    create() {
        let self = this;
        let render = new Render(self);
        self.add.image(300, 300, 'camp').setScale(1.2, 1.2);
        self.add.graphics().lineStyle(1, 0xff0000, 1).strokeRect(0, 0, 1600, 800);

        let username = '玩家' + Math.floor(Math.random() * 1000).toString();
        render.drawInput(750, 200, 200, 60, 28).on('textchange', (input) => {
            username = input.text;
        });

        render.drawTextBox("登录", '#000', 32, 800, 300, 100, 60, 13, 0xffea2b, 'pointerdown', () => {
            socket.emit("login", username);
            console.log('你的用户名为 ' + username);
            self.scene.start('Game', {username});
            self.visible = false;
        });
    }

    update() {

    }
}