const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

server.listen(3000);

app.get('/', function(request, respons) {
	respons.sendFile(__dirname + '/index.html');
});

let connections = [];

io.sockets.on('connection', function(socket) {
    socket.on('create new user', function(data) {
        console.log(data + " вошел в чат");
        connections.push({socketId: socket.id, user: data}); 
       
    })

	socket.on('disconnect', function(data) {
        console.log(connections.find(c => c.socketId === socket.id).user + ' отключился');
		connections.splice(connections.indexOf(c => c.socketId === socket.id), 1);
	});

    socket.on('message', function(data) {
        io.sockets.emit('new message', {user: connections.find(c => c.socketId === socket.id).user, msg: data.msg});
    })
});
