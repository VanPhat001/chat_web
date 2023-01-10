import config from '../config'
import { io } from 'socket.io-client'
import accountService from '../services/account.service'

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
    },

    async fetchAccountMap(context) {
        console.log('>> start: fetch accountMap', new Date().toLocaleString())
        const accountMap = context.state.accountMap
        const tasks = []

        const keys = [...accountMap.keys()]
        keys.forEach(accid => {
            tasks.push(accountService.getById(accid))
        })

        const data = await Promise.all(tasks)
        data.forEach(acc => {
            if (accountMap.get(acc._id).timeLastActive != acc.timeLastActive) {
                accountMap.set(acc._id, acc)
            }
        })
        console.log('>> finish: fetch accountMap', new Date().toLocaleString())
    },

    async userOnline(context) {
        const user = context.state.account
        console.log('>> user online', user)

        await accountService.updateById(user._id, { timeLastActive: null })
        user.timeLastActive = null

        context.state.accountMap_intervalId = setInterval(() => {
            context.dispatch('fetchAccountMap')
        }, 20000);
    },

    async userOffline(context) {
        const user = context.state.account
        console.log('>> user offline', user)

        clearInterval(context.state.accountMap_intervalId)
        context.state.accountMap_intervalId = null

        await accountService.updateById(user._id, { timeLastActive: new Date() })
        context.state.accountMap.clear()
    }
}

export default actions