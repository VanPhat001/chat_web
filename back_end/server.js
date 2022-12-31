const { server, io } = require('./app')
const MongoDB = require('./src/utils/mongodb.util')
const config = require('./src/config')


io.on('connection', socket => {
    console.log('>> a user connected')

    socket.on('disconnect', (reason) => {
        console.log('>> have a user disconnect');
        console.log(reason);
    })

    socket.on('create-room', senderId => {
        // senderId === roomId === roomName
        socket.join(senderId)
        console.log('>> create room', senderId)
    })

    socket.on('send-message-to-friend-chat', message => {
        console.log('>> receive data')
        const {sender, receipient, content, timeSend} = message // content = {text, image}


        io.to(receipient).emit('receive-message-from-friend-chat', message)
        console.log('>> send data to other client in room-chat')
    })
})


async function startServer() {
    try {
        await MongoDB.connect(config.db.uri)
        console.log('ket noi thanh cong');

        const PORT = config.app.port
        server.listen(PORT, () => {
            console.log('listen http://localhost:' + PORT)
        })
    } catch (error) {
        console.log('ket noi that bai');
        process.exit()
    }
}

startServer()