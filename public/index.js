import Game from "./src/scenes/game.js"
import Login from "./src/scenes/login.js"

const config = {
    type: Phaser.AUTO,
    width: 1600,
    height: 900,
    parent: document.body,
    backgroundColor: '#ffffff',
    scaleMode: Phaser.Scale.ScaleModes.FIT,
    dom: {
        createContainer: true
    },
    scene: [
        Login,
        Game
    ]
};

const game = new Phaser.Game(config);