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

    // update by id
    async updateById(id, { author, content, timePost, likes, comments }) {
        const post = { author, content, timePost, likes, comments }
        Object.keys(post).forEach(item => {
            if (post[item] === undefined) {
                delete post[item]
            }
        })

        return await this.Post.updateOne(
            { _id: ObjectId(id) },
            { $set: post })
    }

    // delete by id
    async deleteById(id) {
        return await this.Post.deleteOne({
            _id: ObjectId(id)
        })
    }

}

module.exports = PostService