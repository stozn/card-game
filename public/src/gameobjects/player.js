export default class Player {
    static CAMP = 0;
    static EXPLORE = 1;

    constructor(scene, username) {
        this.username = username;
        this.bag = 0;
        this.camp = 0;
        this.state = this.CAMP;
        this.scene = scene;
    }

    render(x, y) {
        this.x = x;
        this.y = y;
        this.box = this.scene.add.graphics();
        this.box.fillStyle(0xf0f040, 1);
        this.box.strokeRect(x, y, 160, 60);
        this.box.fillRect(x, y, 160, 60);
        let text = `${this.username} - ${this.state === this.CAMP ? '冒险中' : '已返回'} ${this.bag}  `
        this.text = this.scene.add.text(x, y, text, { fontFamily: 'SimHei', fontSize: '32px', fill: '#000' });
        this.text.setDepth(1);
        return {box: this.box, text: this.text};
    }

    update() {
        this.text.setText(`${this.username} - ${this.state === this.CAMP ? '冒险中' : '已返回'} ${this.bag}  `);
    }
}