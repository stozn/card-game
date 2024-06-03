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
        this.choice = '冒险';
    }
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

let players = [];
let states = { round: 1, day: 1, gem: 0, artifact: [], disaster: [0, 0, 0, 0, 0], card: null };
let messages = [];
let logs = [];

let artifactValues = [5, 7, 8, 10, 12];
let artifactNames = ['破旧的剑', '破旧的盾', '破旧的法杖', '破旧的戒指', '破旧的项链'];
let artifactCards = Array.from({ length: 5 }, (_, i) => ({ type: 'artifact', id: i + 1, value: artifactValues[i], name: artifactNames[i] }));
let disasterNames = ['金', '木', '水', '火', '土'];
let disasterCards = Array.from({ length: 5 }, (_, i) => ({ type: 'disaster', id: i + 1, name: disasterNames[i] }));
let gemValues = [15, 17, 5, 9];
let gemCards = Array.from({ length: 4 }, (_, i) => ({ type: 'gem', id: i + 1, value: gemValues[i] }));
const allCards = artifactCards.concat(disasterCards, disasterCards, disasterCards, gemCards, gemCards, gemCards);
let curAllCards = allCards.slice();
let cards = shuffle(curAllCards.slice());

io.on('connection', function (socket) {
    console.log('A user connected: ' + socket.id);

    socket.on('login', function (username) {
        let player = new Player(socket.id, username);
        players.push(player);
        io.emit('updateInfo', { players, states: states });
        io.emit('updateMessage', messages);
        io.emit('updateLog', logs);
    });

    function over(log) {
        log += '大家都已返回营地';
        players.forEach(p => {
            p.bag = 0;
            p.ready = false;
            p.state = '冒险中';
        });
        states.round++;
        states.day = 1;
        states.gem = 0;
        states.artifact = [];
        states.disaster = [0, 0, 0, 0, 0];
        states.card = null;
        cards = shuffle(curAllCards.slice());
        return log;
    }

    function drawCard(log) {
        console.log(cards);
        let card = cards.pop();
        states.card = card;
        let { type, id } = card;
        io.emit('drawCard', { type, id });
        if (card.type === 'gem') {
            let n = players.filter(p => p.state === '冒险中').length;
            let gain = Math.floor(card.value / n);
            states.gem += card.value % n;
            players.forEach(p => p.state === '冒险中' && (p.bag += gain));
            log += `找到了${card.value}宝石, 每人分得${gain}宝石 `;
        }

        if (card.type === 'artifact') {
            states.artifact.push(card);
            log += `找到了神器${card.id}, 价值${card.value} `;
        }

        if (card.type === 'disaster') {
            let cnt = ++states.disaster[card.id - 1];
            if (cnt > 1) {
                curAllCards.splice(curAllCards.findIndex(c => c.id === card.id && c.type === 'disaster'), 1);
                log += `触发了陷阱【${card.name}】，`;
                log = over(log);
            } else log += `感应到陷阱【${card.name}】的气息，接下来要小心了！ `;
        }
        return log;
    }

    function next() {
        if (players.every(p => p.ready === true || p.state === '已返回')) {
            let back = players.filter(p => p.choice === '返回');
            let bn = back.length;
            let log = 'D' + states.day + ' ';
            if (bn) {
                back.forEach((p) => {
                    p.state = '已返回';
                    p.choice = null;
                    p.camp += p.bag + states.gem / bn;
                    p.bag = 0;
                });

                states.gem = states.gem % bn;
                if (bn == 1) {
                    // log += `${back[0].name}独自返回，带走了${states.artifact.length > 0 ? "神器和" : ""}${states.gem}宝石, `;
                    back[0].camp += states.artifact.reduce((val, art) => val + art.value, 0);
                    states.artifact = [];
                }// else log += bn + `名玩家溜了, 每人带走了${states.gem / bn}宝石, `;
                log += bn + '名玩家溜了，';
            }   

            states.day++;
            players.forEach(p => p.ready = false);

            if (players.filter(p => p.state === '冒险中').length == 0) log = over(log);
            else log = drawCard(log);

            logs.push(log);
            if (logs.length > 12) logs = logs.slice(-12);
            io.emit('updateLog', logs);
        }
        io.emit('updateInfo', { players, states: states });
    }

    socket.on('ready', () => {
        let user = players.find(player => player.id === socket.id);
        if (user) {
            user.ready = true;
            user.choice = '冒险';
            next();
        }
    });

    socket.on('back', () => {
        let user = players.find(player => player.id === socket.id);
        if (user) {
            user.ready = true;
            user.choice = '返回';
            next();
        }
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected: ' + socket.id);
        players = players.filter(player => player.id !== socket.id);
        io.emit('updateInfo', { players, states: states });
        if (players.length == 0) {
            states = { round: 1, day: 1, gem: 0, artifact: [], disaster: [0, 0, 0, 0, 0], card: null };
            messages = [];
            logs = [];
            curAllCards = allCards.slice();
            cards = shuffle(curAllCards.slice());
        }
    });

    socket.on('sendMessage', ({ user, msg }) => {
        console.log(user + ': ' + msg);
        messages.push({ user, msg });
        if (messages.length > 7) messages = messages.slice(-7);
        io.emit('updateMessage', messages);
    });
});

server.listen(port, () => {
    console.log(`服务器已启动在端口 ${port}`)
})