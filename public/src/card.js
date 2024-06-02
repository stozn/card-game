export default class Card {
    constructor(scene, config) {
        console.log(config);
        this.type = config.type;
        this.id = config.id;
        this.img = this.type + '-' + this.id;
        if(this.type === 'gem') {
            this.value = config.value;
        }
        this.render = (x, y) => {
            let card = scene.add.image(x, y, this.img);
            return card;
        }
    }
}