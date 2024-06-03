import Card from './card.js';

export default class Dealer {
    constructor(scene) {
        this.scene = scene;
        this.cardTypes = ['artifact', 'disaster', 'gem'];
    }

    dealCards() {
        let rand = (n) => {
            return Math.floor(Math.random() * n);
        }
        let sample = (array) => {
            return array[rand(array.length)];
        }
        
        let curCard = new Card(this.scene, {type: sample(this.cardTypes), id: rand(4) + 1, value: rand(6)});
        curCard.render(35, 27);
    }
}