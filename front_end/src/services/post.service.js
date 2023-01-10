import axios from 'axios'
import config from '../config'

class PostService {
    constructor() {
        this.api = axios.create({
            baseURL: config.axiosURL
        })
    }

    async getAll() {
        // [GET] /api/post/
        return (await this.api.get('/post')).data
    }

    async getByAuthor(author) {
        // [GET] /api/post/author/:id
        return (await this.api.get(`/post/author/${author}`)).data
    }

    async create({ author, content = { text: null, image: null }, likes = [], comments = [] }) {
        // [POST] /api/post/
        return (await this.api.post('/post', {
            author: author,
            content: content,
            likes: likes,
            comments: comments
        })).data
    }

    async updateById(id, { author, content, timePost, likes, comments }) {
        // [PATCH] /api/post/:id
        return (await this.api.patch(`/post/${id}`, {
            author, content, timePost, likes, comments
        })).data
    }

    async pushComment(postId, cmtId) {
        // [PATCH] /api/post/:id/cmt/:cmtId
        return (await this.api.patch(`/post/${postId}/cmt/${cmtId}`)).data
    }
}

export default new PostService()