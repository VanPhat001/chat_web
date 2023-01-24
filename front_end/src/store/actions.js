import config from '../config'
import { io } from 'socket.io-client'
import accountService from '../services/account.service'
import messageService from '../services/message.service'

import utils from '../utils'

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

    // tạo document cho message collection 
    // tạo thành công thì trả về message được tạo (xem chỉnh lại trả về insertedId)
    // thất bại thì trả về null
    async createAndSendMessage(context, { sender, receipient, text }) {
        const EMPTY_STRING = ''
        if (text != EMPTY_STRING) {
            console.log('send message:', text);

            try {
                const content = {
                    text: null,
                    image: null
                }
                if (await utils.isImgUrl(text)) {
                    content.image = text
                }
                else {
                    content.text = text
                }

                const message = {
                    sender: sender,
                    receipient: receipient,
                    content: content,
                    timeSend: new Date()
                }

                await messageService.createMessage(message.sender, message.receipient, message.content)
                return message
            } catch (error) {
                console.log(error)
            }
        }

        return null
    },

    async fetchAccountMap(context) {
        console.log('>> start: fetch accountMap', new Date().toLocaleString())
        const accountMap = context.state.accountMap

        const keys = [...accountMap.keys()]
        // keys.forEach(accid => {
        //     tasks.push(accountService.getById(accid))
        // })

        // const data = await Promise.all(tasks)
        const data = await accountService.getMany(keys)
        data.forEach(acc => {
            if (accountMap.get(acc._id).timeLastActive != acc.timeLastActive) {
                accountMap.set(acc._id, acc)
            }
        })
        console.log('>> finish: fetch accountMap', new Date().toLocaleString())
    },

    async userOnline(context) {
        // xem xét lại dòng này, có khả năng dữ liệu trong accountMap còn dùng được
        context.state.accountMap.clear()

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
    },

    async pushToAccountMap({ state }, accIdArray) {
        const accountMap = state.accountMap

        const accounts = await accountService.getMany(accIdArray)
        accounts.forEach(account => {
            accountMap.set(account._id, account)
        })
    },
}

export default actions