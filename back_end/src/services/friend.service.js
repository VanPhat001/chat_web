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

    async getByAccountId(accId, isAccept) {
        return await this.Friend.find({
            $or: [
                { accountId1: accId },
                { accountId2: accId }
            ],
            isAccept: isAccept
        }).toArray()
    }

    async create(accountId1, accountId2, isAccept = false) {
        return await this.Friend.insertOne({
            accountId1: accountId1,
            accountId2: accountId2,
            isAccept: isAccept
        })
    }

    async updated(id, { accountId1, accountId2, isAccept }) {
        const friend = { accountId1, accountId2, isAccept }
        Object.keys(friend).forEach(item => {
            if (friend[item] === undefined) {
                delete friend[item]
            }
        })

        return await this.Friend.updateOne(
            { _id: ObjectId(id) },
            { $set: friend }
        )
    }

    async updatedByAccount(accountId1, accountId2, isAccept) {
        return await this.Friend.updateOne(
            {
                $or: [
                    {
                        accountId1: accountId1,
                        accountId2: accountId2
                    },
                    {
                        accountId1: accountId2,
                        accountId2: accountId1
                    }
                ]
            },
            {
                $set: { isAccept: isAccept }
            }
        )
    }

    async delete(id) {
        return await this.Friend.deleteOne({
            _id: ObjectId(id)
        })
    }

    async deleteByAccount(accountId1, accountId2) {
        return await this.Friend.deleteOne({
            $or: [
                {
                    accountId1: accountId1,
                    accountId2: accountId2
                },
                {
                    accountId1: accountId2,
                    accountId2: accountId1
                }
            ]
        })
    }
}

module.exports = FriendService