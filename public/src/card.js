export default class Card {
    constructor(scene) {
        let self = this;
        self.scene = scene;
        self.card = null;
        self.isDown = true;
        self.render = (x, y, sprite) => {
            self.x = x;
            self.y = y;
            self.card = scene.add.image(x, y, sprite).setScale(0.5, 0.5).setInteractive();
            let timer;
            let isHold = false;
            self.card.on('pointerdown', () => {
                self.scene.children.bringToTop(self.card);
                timer = setTimeout(() => {
                    isHold = true;
                    self.card.setScale(1, 1);
                }, 800)
            })
            self.card.on('pointerup', () => {
                if(isHold) {
                    self.card.setScale(0.5, 0.5);
                    isHold = false;
                }else{
                    clearTimeout(timer);
                    self.x+=120;
                    self.card.setPosition(self.x, self.y);
                }
            })
            // this.input.on('drag', function (pointer, card, dragX, dragY) {
            //     card.x = dragX;
            //     card.y = dragY;
            // })
    
            // this.input.on('dragstart', function (pointer, card) {
            //     card.setTint(0xff69b4);
            //     self.children.bringToTop(card);
            // })
    
            // this.input.on('dragend', function (pointer, card, dropped) {
            //     card.setTint();
            //     if (!dropped) {
            //         card.x = card.input.dragStartX;
            //         card.y = card.input.dragStartY;
            //     }
            // })
            return self.card;
        }
    }
}