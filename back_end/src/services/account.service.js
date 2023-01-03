const { ObjectId } = require('mongodb')
const MongoDB = require('../utils/mongodb.util')

class AccountService {
    constructor() {
        this.Account = MongoDB.client.db().collection('accounts')
    }

    // get all
    async getAll() {
        return await this.Account.find({}).toArray()
    }

    // find by username & password
    async findByUsernameAndPassword(username, password) {
        return await this.Account.findOne({
            username: username,
            password: password
        })
    }

    // find by name or id
    async findByNameOrId(text) {
        let _id = null
        try { _id = ObjectId(text) }
        catch (error) { }

        const regex = new RegExp(["^", text, "$"].join(""), "i");
        // Creates a regex of: /^text-value$/i        

        const data = await this.Account.aggregate([
            {
                $project: {
                    'name': {
                        $concat: ["$lastName", " ", "$firstName"]
                    }
                }
            },
            {
                $match: {
                    $or: [
                        { '_id': _id },
                        { 'name': regex }
                    ]
                }
            }
        ]).toArray()

        return data
    }

    // get by id
    async getById(id) {
        return await this.Account.findOne({ _id: ObjectId(id) })
    }

    // create account
    async create(username, password, firstName, lastName, email, avatar) {
        const account = {
            username: username,
            password: password,
            timeLastActive: null,
            firstName: firstName,
            lastName: lastName,
            email: email,
            gender: null,
            address: null,
            avatar: avatar
        }

        return await this.Account.insertOne(account)
    }

    // update by id
    async updateById(id, { username, password, timeLastActive, firstName, lastName, email, gender, address, avatar }) {
        const account = { username, password, timeLastActive, firstName, lastName, email, gender, address, avatar }
        Object.keys(account).forEach(item => {
            if (account[item] === undefined) {
                delete account[item]
            }
        })

        return await this.Account.updateOne(
            { _id: ObjectId(id) },
            { $set: account })
    }

    // delete by id
    async deleteById(id) {
        return await this.Account.deleteOne({
            _id: ObjectId(id)
        })
    }
}

module.exports = AccountService