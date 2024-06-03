const express = require('express')
const app = express()
const server = require('http').createServer(app)
const { Server } = require('socket.io')
const io = new Server(server)

const port = 80

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

let players = [];

io.on('connection', function (socket) {
    console.log('A user connected: ' + socket.id);

    players.push(socket.id);
    socket.on('login', function (username) {
        io.emit('addPlayer', username);
    });

    socket.on('dealCards', function () {
        io.emit('dealCards');
    });

    socket.on('disconnect', function () {
        console.log('A user disconnected: ' + socket.id);
        players = players.filter(player => player !== socket.id);
    });

    let msgNum = 0;
    socket.on('sendMessage', ({ user, msg }) => {
        console.log(user + ': ' + msg);
        msgNum++;
        io.emit('sendMessage', {user, msg});
    });
});

server.listen(port, () => {
    console.log(`服务器已启动在端口 ${port}`)
})