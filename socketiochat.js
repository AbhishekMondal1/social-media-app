const express = require('express')
const app = express()
const socket = require('socket.io')



app.use(express.static('public'))
const server = app.listen(4000, () => {
    console.log("listening req on 4000");
})

const io = socket(server)
let users=[]
var i = 0;
io.on('connection', (socket) => {
   // var ids = {}
    //ids[i++] = socket.id
   // console.log(ids)
    console.log("socket connected", socket.id)
    socket.on('chat', (data) => {
        //io.to(ids[1]).emit('chat', data)
        //console.log(socket.id)
        //io.to(socket.rooms)
        io.emit('chat',data)
    })
  
 

   /* socket.on('chat', ({room,message}) => {
        socket.to(room).emit('chat', {
            message,
            name:"frind"
        })
    })*/

    socket.on('typing', (data) => {
       // socket.to(data.socketid).emit('typint',data.handle)
        socket.broadcast.emit('typing', data)
    })
})
 