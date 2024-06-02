import Game from "./src/game.js"

const config = {
    type: Phaser.AUTO,
    width: 1600,
    height: 900,
    backgroundColor: '#ffffff',
    scaleMode: 1,
    scene: [
        Game
    ]
};

const game = new Phaser.Game(config);