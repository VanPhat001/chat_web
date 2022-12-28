import axios from 'axios'
import config from '../config'

class AccountService {
    constructor() {
        this.api = axios.create({
            baseURL: config.axiosURL
        })
    }

    async findByUsernameAndPassword(username, password) {
        // [GET] /api/account/usr/:username/pwrd/:password
        return (await this.api.get(`/account/usr/${username}/pwrd/${password}`)).data
    }

    async getById(accountId) {
        // [GET] /api/account/:id
        return (await this.api(`/account/${accountId}`)).data
    }
}

export default (new AccountService())