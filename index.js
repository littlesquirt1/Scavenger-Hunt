const fs = require('fs');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const { response } = require('express');
const io = new Server(server);

var ajoined = 0;
var bjoined = 0;

var aid = '';
var bid = '';

var alevel = 0;
var blevel = 0;

var clues = fs.readFileSync('clues.txt').toString().replace(/\r\n/g,'\n').split('\n');
var codes = fs.readFileSync('codes.txt').toString().replace(/\r\n/g,'\n').split("\n");

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/script.js', (req, res) => {
  res.sendFile(__dirname + '/script.js');
});

app.get('/test', (req, res) => {
  res.sendFile(__dirname + '/test.html');
});

io.on('connection', (socket) => {
    console.log('A socket with an id of "' + socket.id + '" joined the game!')
    
    socket.on('teama', (callback) => {
        if (ajoined == 0) {
            ajoined = 1
            aid = socket.id
            console.log('A socket with an id of "' + socket.id + '" joined the A team!')
            callback(clues[alevel])
        } else {
            console.log('A socket with an id of "' + socket.id + '" failed to join the A team because it was full!')
            callback(0)
        }
    });

    socket.on('teamb', (callback) => {
        if (bjoined == 0) {
            bjoined = 1
            bid = socket.id
            console.log('A socket with an id of "' + socket.id + '" joined the B team!')
            callback(clues[blevel])
        } else {
            console.log('A socket with an id of "' + socket.id + '" failed to join the B team because it was full!')
            callback(0)
        }
    });

    socket.on('codescan', (code, callback) => {
        console.log(code)
        console.log(codes[alevel])
        if (socket.id == aid) {
            if (alevel == clues.length - 1) {
                console.log('A SOCKET WITH AN ID OF: "' + socket.id + '"' + " FOR A TEAM'S CAMERA DID NOT DISAPPEAR PROPPERLY!!!")
                callback(2)
            } else if (code == codes[alevel]) {
                alevel++;
                if (alevel == clues.length - 1) {
                    callback({lastclue: true, clue: clues[alevel]})
                } else {
                    callback(clues[alevel])
                }
            } else {
                callback(1)
            }
        } else if (socket.id == bid) {
            if (blevel == clues.length - 1) {
                console.log('A SOCKET WITH AN ID OF: "' + socket.id + '"' + " FOR B TEAM'S CAMERA DID NOT DISAPPEAR PROPPERLY!!!")
                callback(2)
            } else if (code == codes[blevel]) {
                blevel++;
                if (blevel == clues.length - 1) {
                    callback({lastclue: true, clue: clues[blevel]})
                } else {
                    callback(clues[blevel])
                }
            } else {
                callback(1)
            }
        }
    });

    socket.on('disconnecting', () => {
        if (aid == socket.id) {
            aid = '';
            ajoined = 0;
            console.log('The socket for the A team "' + socket.id + '" left the game!')
        } else if (bid == socket.id) {
            bid = '';
            bjoined = 0;
            console.log('The socket for the B team "' + socket.id + '" left the game!')
        } else {
            console.log('A socket with no team "' + socket.id + '" left the game!')
        }
    });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});