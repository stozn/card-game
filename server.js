const express = require('express')
const app = express()
const server = require('http').createServer(app)
const { Server } = require('socket.io')
const io = new Server(server)

const port = 80

class Player {
    constructor(id, username) {
        this.id = id;
        this.name = username;
        this.bag = 0;
        this.camp = 0;
        this.state = '冒险中';
        this.ready = false;
    }
}

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

let players = [];

io.on('connection', function (socket) {
    console.log('A user connected: ' + socket.id);

    socket.on('login', function (username) {
        let player = new Player(socket.id, username);
        players.push(player);
        io.emit('updatePlayers', players);
    });

    socket.on('ready', () => {
        let user = players.find(player => player.id === socket.id);
        if (user) {
            user.ready = true;
            if (players.every(player => player.ready === true || player.state === '已返回')) {
                players.forEach(player => player.ready = false);
                let types = ['artifact', 'disaster', 'gem'];
                let type = types[Math.floor(Math.random() * types.length)];
                let id = Math.floor(Math.random() * 4) + 1;
                io.emit('dealCards', { type, id });
            }
            io.emit('updatePlayers', players);
        }
        console.log(players);
    });

    socket.on('back', () => {
        let user = players.find(player => player.id === socket.id);
        if (user) {
            user.ready = false;
            user.state = '已返回';
            user.camp += user.bag;
            user.bag = 0;
            if (players.every(player => player.ready === true || player.state === '已返回')) {
                players.forEach(player => player.ready = false);
                let types = ['artifact', 'disaster', 'gem'];
                let type = types[Math.floor(Math.random() * types.length)];
                let id = Math.floor(Math.random() * 4) + 1;
                io.emit('dealCards', { type, id });
            }
            io.emit('updatePlayers', players);
        }
        console.log(players);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected: ' + socket.id);
        players = players.filter(player => player.id !== socket.id);
        io.emit('updatePlayers', players);
    });

    let msgNum = 0;
    socket.on('sendMessage', ({ user, msg }) => {
        console.log(user + ': ' + msg);
        msgNum++;
        io.emit('sendMessage', { user, msg });
    });
});

server.listen(port, () => {
    console.log(`服务器已启动在端口 ${port}`)
})