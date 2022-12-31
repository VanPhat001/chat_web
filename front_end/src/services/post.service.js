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

    async create({ author, content, likes = [], comments = [] }) {
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
}

export default new PostService()