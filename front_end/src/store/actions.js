import config from '../config'
import { io } from 'socket.io-client'

const actions = {
    connectSocket(context) {
        context.state.socket = io(config.socketDomain, {
            transports: ['websocket']
        })

        const sender = context.state.account._id
        context.state.socket.emit('create-room', sender)

        context.state.socket.on('receive-message-from-friend-chat', message => {
            console.log('receive message from friend', message)
            context.state.receiveMessageQueue.push(message)
        })
    },
    
    socketSendMessageToFriendChat(context, message) {
        console.log('send message socket', message)
        context.state.socket.emit('send-message-to-friend-chat', message)
    }
}

export default actions