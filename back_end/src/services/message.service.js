const { ObjectId } = require('mongodb')
const MongoDB = require('../utils/mongodb.util')

class MessageService {
    constructor() {
        this.Message = MongoDB.client.db().collection('messages')
    }

    // get all
    async getAll() {
        return await this.Message.find({}).toArray()
    }

    // get by id
    async getById(id) {
        return await this.Message.findOne({ _id: ObjectId(id) })
    }

    async getMany(idList) {
        idList.forEach((item, index) => {
            idList[index] = ObjectId(item)
        })

        return await this.Message.find({
            _id: {
                $in: idList
            }
        }).toArray()
    }

    // create message
    async create(sender, receipient, content, unsend = false, response = null) {
        const timeSend = new Date()
        const message = {
            sender: sender,
            receipient: receipient,
            content: content,
            timeSend: timeSend,
            unsend: unsend,
            response: response
        }

        return await this.Message.insertOne(message)
    }

    // update by id
    async updateById(id, { sender, receipient, content, timeSend, unsend, response }) {
        const message = { sender, receipient, content, timeSend, unsend, response }
        Object.keys(message).forEach(item => {
            if (message[item] === undefined) {
                delete message[item]
            }
        })

        return await this.Message.updateOne(
            { _id: ObjectId(id) },
            { $set: message })
    }

    // delete by id
    async deleteById(id) {
        return await this.Message.deleteOne({
            _id: ObjectId(id)
        })
    }

    // find by accountId
    async findByAccount(id1, id2) {
        return await this.Message.find({
            $or: [
                { sender: id1, receipient: id2 },
                { sender: id2, receipient: id1 }
            ]
        }).sort('timeSend', 1).toArray()
    }

    // get all last messages of user
    async getAllMesseageOfUser(userId) {
        return await this.Message.find({
            $or: [
                { sender: userId },
                { receipient: userId }
            ]
        }).toArray()
    }

    // get friends chat
    async getFriendsChat(accountId) {
        // this.Message.distinct('')
        const result = this.Message.aggregate([
            {
                $match: {
                    $or: [
                        { sender: accountId },
                        { receipient: accountId }
                    ]
                }
            },
            { "$group": { "_id": { sender: "$sender", receipient: "$receipient" } } }
        ])
        return await result.toArray()
    }

    // delete all messages 
    async deleteAll() {
        return await this.Message.deleteMany({})
    }
}

module.exports = MessageService