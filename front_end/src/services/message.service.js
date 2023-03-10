import axios from "axios"
import config from "../config"

class MessageService {
    constructor() {
        this.api = axios.create({
            baseURL: config.axiosURL
        })
    }

    // accountId == sender || accountId = receipient
    async findByAccount(accountId) {
        // [GET] /api/message/acc/:id
        return (await this.api.get(`/message/acc/${accountId}`)).data
    }

    async getFriendsChat(accountId) {
        // [GET] /api/message/:id/friends
        return (await this.api.get(`/message/${accountId}/friends`)).data
    }

    async getAllMessage(accountId1, accountId2) {
        // [GET] /api/message/acc/:id1/:id2
        return (await this.api.get(`/message/acc/${accountId1}/${accountId2}`)).data
    }

    async createMessage(sender, receipient, content) {
        // [POST] /api/message/
        return (await this.api.post('/message', {
            sender: sender,
            receipient: receipient,
            content: content
        })).data
    }

    async updateById(id, { sender, receipient, content, timeSend, unsend, response }) {
        // [PATCH] /api/message/:id
        return (await this.api.patch(`/message/${id}`, {
            sender: sender, 
            receipient: receipient, 
            content: content, 
            timeSend: timeSend, 
            unsend: unsend, 
            response: response
        })).data
    }

    async getAllLastMessOfUserToFriends(id) {
        // [GET] /api/message/last/acc/:id
        return (await this.api.get(`/message/last/acc/${id}`)).data
    }
}

export default new MessageService()