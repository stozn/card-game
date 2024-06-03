export default class Render {
    constructor(scene) {
        this.scene = scene;
    }

    drawText(cont, x, y, color, size) {
        let text = this.scene.add.text(x, y, cont, {
            fontFamily: 'SimHei',
            fontSize: size + 'px',
            fill: color
        });
        text.setOrigin(0.5, 0.5);
        return text;
    }

    drawBox(x, y, w, h, r, color, linew=null, linec=null) {
        let box = this.scene.add.graphics();
        if (linew) {
            box.lineStyle(linew, linec);
        }
        box.fillStyle(color, 1);
        box.strokeRoundedRect(x, y, w, h, r);
        box.fillRoundedRect(x, y, w, h, r);
        return box;
    }

    drawTextBox(cont, fontColor, fontsize, x, y, w, h, r, color, linew=null, linec=null, event = null, callback = null) {
        let box = this.drawBox(x, y, w, h, r, color, linew, linec);
        let text = this.drawText(cont, x + w / 2, y + h / 2, fontColor, fontsize).setFontStyle('bold');
        if (event) {
            box.setInteractive(new Phaser.Geom.Rectangle(x, y, w, h), Phaser.Geom.Rectangle.Contains).on(event, callback);
            text.setInteractive().on(event, callback);
        }
        return { box: box, text: text };
    }

    drawInput(x, y, w, h, fontsize, type = 'text') {
        let input = this.scene.add.rexInputText(x + w / 2, y + h / 2, w, h, {
            type: type,
            fontSize: fontsize + 'px',
            fontFamily: 'SimHei',
            color: '#000000',
            border: '2px solid',
            borderRadius: '7px',
            borderColor: '#000000',
        })
        return input;
    }
}