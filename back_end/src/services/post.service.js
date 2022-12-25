const { ObjectId } = require('mongodb')
const MongoDB = require('../utils/mongodb.util')

class PostService {
    constructor() {
        this.Post = MongoDB.client.db().collection('posts')
    }

    // get all
    async getAll() {
        return await this.Post.find({}).toArray()
    }

    // get by id
    async getById(id) {
        return await this.Post.findOne({ _id: ObjectId(id) })
    }

    // create post
    async create(author, content, likes, comments) {
        const timePost = new Date()
        const post = {
            author: author,
            content: content,
            timePost: timePost,
            likes: likes,
            comments: comments
        }

        return await this.Post.insertOne(post)
    }

    // delete by id
    async deleteById(id) {
        return await this.Post.deleteOne({
            _id: ObjectId(id)
        })
    }

}

module.exports = PostService