export default class Card {
    constructor(scene, config) {
        this.type = config.type;
        this.id = config.id;
        this.img = this.type + '-' + this.id;
        if (this.type === 'gem') {
            this.value = config.value;
        }
        this.render = (x, y, w = 207, h = 295) => {
            let card = scene.add.image(x + 103.5, y + 147.5, this.img).setScale(0.7, 0.7).setDepth(2);
            return card;
        }
    }
}