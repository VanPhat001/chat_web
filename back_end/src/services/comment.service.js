const { ObjectId } = require('mongodb')
const MongoDB = require('../utils/mongodb.util')

class CommentService {
    constructor() {
        this.Comment = MongoDB.client.db().collection('comments')
    }

    // get all
    async getAll() {
        return await this.Comment.find({}).toArray()
    }

    // get by id
    async getById(id) {
        return await this.Comment.findOne({ _id: ObjectId(id) })
    }

    async getMany(idList) {
        idList.forEach((item, index) => {
            idList[index] = ObjectId(item)
        })

        return await this.Comment.find({
            _id: {
                $in: idList
            }
        }).toArray()
    }

    // create post
    async create(accountId, image, text, comments) {
        const timeComment = new Date()
        const comment = {
            accountId: accountId,
            image: image,
            text: text,
            timeComment: timeComment,
            comments: comments,
        }

        return await this.Comment.insertOne(comment)
    }

    // delete by id
    async deleteById(id) {
        return await this.Comment.deleteOne({
            _id: ObjectId(id)
        })
    }

}

module.exports = CommentService