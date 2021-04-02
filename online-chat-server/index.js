const express = require('express');
const socketio = require('socket.io');
const http = require('http');

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users.js');

const PORT = process.env.PORT || 5000

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: "http://localhost:3000", 
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    socket.on('join', ({ name, room }, callback) => {
        // because addUser() returns error/user, so
        const { error, user } = addUser({ id: socket.id, name, room });

        if(error) return callback(error);

        // welcome message
        // admin-generated messages are in 'message' tunnel
        socket.emit('message', { user: 'admin', text: `${user.name}, welcome to the room ${user.room}`});

        // send message to everyone except specific user
        socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name}, has joined!`});

        // no errors, call socket built in method
        socket.join(user.room);

        // why callback here? 
        // cuz no error so no parameter here. 
        callback();
    });

    // create event for user-generated messages in 'sendMessage' tunnel
    // accept message from users
    socket.on('sendMessage', (message, callback) => {
        // get user's information
        const user = getUser(socket.id);

        // send message to the room
        io.to(user.room).emit('message', { user: user, text: message});

        callback();
    });
    socket.on('disconnect', () => {
        console.log('User had left!!!');
    })
});

app.use(router);

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));