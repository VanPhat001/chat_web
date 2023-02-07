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
        const { sender, receipient, content, timeSend } = message // content = {text, image}

        io.to(receipient).emit('receive-message-from-friend-chat', message)
        console.log(`>> send data to client ${receipient} in room-chat`)
    })

    socket.on('commentTo', ({ receipient, commentId, postId }) => {
        console.log('>> receive data')

        io.to(receipient).emit('receive-comment', commentId, postId)
        console.log(`>> send comment to ${receipient}: ${commentId}`)
    })

    socket.on('like-post-to', ({ from, to, postId }) => {
        console.log('>> receive data')

        io.to(to).emit('receive-like-post', from, postId)
        console.log(`>> ${from} like post of ${to}`)
    })




    socket.on('open-camera', ({ caller, receipient, stream }) => {
        console.log('>>>>> open-camera')
    })

    socket.on('close-camera', ({ caller, receipient }) => {
        console.log('>>>>> close-camera')
    })

    socket.on('ask-callId', ({ caller, receipient }) => {
        console.log(`>>>>> ${caller} ask-callId ${receipient}`)

        io.to(receipient).emit('ask-callId', {
            caller: caller,
            receipient: receipient
        })
    })

    socket.on('response-callId', ({ caller, receipient, callId }) => {
        io.to(caller).emit('response-callId', {
            caller: caller,
            receipient: receipient,
            callId: callId
        })
    })

    socket.on('reject-call', ({ from, to }) => {
        io.to(to).emit('reject-call', { from, to })
    })

    socket.on('finish-call', ({ from, to }) => {
        io.to(to).emit('finish-call', { from, to })
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