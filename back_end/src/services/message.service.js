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

    // create message
    async create(sender, receipient, content) {
        const timeSend = new Date()
        const message = {
            sender: sender,
            receipient: receipient,
            content: content,
            timeSend: timeSend
        }

        return await this.Message.insertOne(message)
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