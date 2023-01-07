import config from '../config'
import axios from 'axios'

class FriendService {
    constructor() {
        this.api = axios.create({
            baseURL: config.axiosURL
        })
    }

    async getAll() {
        return (await this.api.get('/friend')).data
    }

    async getAllFriendOfAccount(accId) {
        return (await this.api.get(`/friend/accountId/${accId}`)).data
    }
}

export default new FriendService()