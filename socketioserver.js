const express = require('express')
const http = require('http')
const app = express()
const server = http.createServer(app)
const socket = require('socket.io')
const io = socket(server)

let users = []

const messages = {
    general: [],
    random: [],
    jokes: [],
    javascript: []
}

io.on('connection', socket => {
    console.log(socket.id)
    socket.on('join_server', (username) => {
        const user = {
            username,
            id: socket.id,
        }
        users.push(user)
        io.emit("new_user",users)
    })
       
    socket.on("join_room", (roomName, cb) => {
      socket.join(roomName);
        cb(messages[roomName]);        
    });

    socket.on('send_message', ({ content, to, sender, chatName, isChannel }) => {
        if (isChannel) {
            const payload = {
                content,
                chatName,
                sender
            }
            socket.to(to).emit("new_message", payload)
        } else {
            const payload = {
                content,
                chatName: sender,
                sender
            }
            socket.to(to).emit('new_message',payload)
        }
        if (messages[chatName]) {
            messages[chatName].push({
                sender,
                content
            })
        }
    })

    socket.on('disconnect', () => {
        users = users.filter(u => u.id !== socket.id)
        io.emit("new_user", users)
    })
})

server.listen(4007, () => console.log("server running on 4007"))