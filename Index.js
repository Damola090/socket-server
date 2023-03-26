const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const User = require('./Utils/User');
const { generateMessage } = require('./Utils/Message')

app.use(cors());

const userObj = new User()

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    }
});

io.on("connection", (socket) => {
    console.log(`A new User Connected ${socket.id}`)

    socket.on('join', (info, callback) => {
        const { error, user } = userObj.addUser({ id: socket.id, ...info })

        if (error) {
            console.log(error)
            return callback(error)
        }

        socket.join(user.room)
        console.log(user)
        socket.emit('message', user)
        socket.emit('message', generateMessage('Admin', 'welcome'))
        socket.broadcast.to(user.room).emit('message', `${user.username} has joined the room`)
        io.to(user.room).emit('roomData', {
            room: user.room,                        
            users: userObj.getUsersInRoom(user.room)        
        })
        callback()
    })
})


server.listen(3001, () => {
    console.log('Server running on Port 3001')
})

