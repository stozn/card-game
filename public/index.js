import Game from "./src/game.js"

const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 1024,
    scene: [
        Game
    ]
};

const game = new Phaser.Game(config);