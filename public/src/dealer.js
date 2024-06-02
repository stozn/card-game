import Card from './card.js';

export default class Dealer {
    constructor(scene) {
        this.scene = scene;
        this.cardNum = 0;
        this.cardType = ['artifact', 'disaster', 'gem'];
    }

    dealCards() {
        function sample(array) {
            return array[Math.floor(Math.random() * array.length)];
        }
        for (let i = 0; i < 6; i++) {
            let curCard = new Card(this.scene);
            let curSprite = sample(this.cardType) + '-' + (Math.floor(Math.random() * 4) + 1);
            curCard.render(340 + i * 100, 375, curSprite);
        }
        
    }
}