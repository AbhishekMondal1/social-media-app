const socket = io.connect("http://localhost:4000")

const message = document.getElementById('message'),
      handle = document.getElementById('handle'),
      btn = document.getElementById('send'),
      output = document.getElementById('output'),
      feedback = document.getElementById('feedback')

btn.addEventListener('click', () => {
    socket.emit('chat', {
        message: message.value,
        handle: handle.value
    })
    console.log(socket.id)
})

message.addEventListener('keypress', () => {
    feedback.innerHTML="";
    socket.emit('typing',handle.value) // {handle:handle.value,socketid:socket.id })
})

socket.on('chat', (data) => {
    output.innerHTML += '<p><strong>' + data.handle + ':</strong>' + data.message + '</p>'
})

socket.on('typing', (data) => {
    feedback.innerHTML = '<p><em>' + data + 'is typing message...</em></p>'
})