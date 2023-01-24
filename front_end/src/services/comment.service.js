import axios from 'axios'
import config from '../config'

class CommentService {
    constructor() {
        this.api = axios.create({
            baseURL: config.axiosURL
        })
    }

    async getCommentId(id) {
        // [GET] /api/comment/:id
        return (await this.api.get(`/comment/${id}`)).data
    }

    async getMany(idList) {
        // [POST] /api/comment/many
        return (await this.api.post(`/comment/many`, {
            idList: idList
        })).data
    }

    async create({ accountId, image=null, text, comments=[] }) {
        // [POST] /api/comment/
        const data = (await this.api.post('/comment', {
            accountId: accountId,
            image: image,
            text: text,
            comments: comments,
        })).data

        return data
    }
}

export default new CommentService()