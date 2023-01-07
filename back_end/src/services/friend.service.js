const { ObjectId } = require('mongodb')
const MongoDB = require('../utils/mongodb.util')

class FriendService {
    constructor() {
        this.Friend = MongoDB.client.db().collection('friends')
    }

    async getAll() {
        return await this.Friend.find({}).toArray()
    }

    async getById(id) {
        return await this.Friend.findOne({
            _id: ObjectId(id)
        })
    }

    async getByAccountId(accId) {
        return await this.Friend.find({
            $or: [
                { accountId1: accId },
                { accountId2: accId }
            ]
        }).toArray()
    }

    async create(accountId1, accountId2) {
        return await this.Friend.insertOne({
            accountId1: accountId1,
            accountId2: accountId2
        })
    }

    async delete(id) {
        return await this.Friend.deleteOne({
            _id: ObjectId(id)
        })
    }
}

module.exports = FriendService