import axios from 'axios'
import config from '../config'

class AccountService {
    constructor() {
        this.api = axios.create({
            baseURL: config.axiosURL
        })
    }

    async create({ username, password, firstName, lastName, email, avatar }) {
        // [POST] /api/account/
        return (await this.api.post('/account', {
            username: username,
            password: password,
            firstName: firstName,
            lastName: lastName,
            email: email,
            avatar: avatar
        })).data
    }

    async findByUsernameAndPassword(username, password) {
        // [GET] /api/account/usr/:username/pwrd/:password
        return (await this.api.get(`/account/usr/${username}/pwrd/${password}`)).data
    }

    async getById(accountId) {
        // [GET] /api/account/:id
        return (await this.api.get(`/account/${accountId}`)).data
    }

    async getMany(accIdList) {
        // [POST] /api/account/many
        return (await this.api.post(`/account/many`, {
            accIdList: accIdList
        })).data
    }

    async findByNameOrId(text) {
        // [GET] /api/account/text/:text
        return (await this.api.get(`/account/text/${text}`)).data
    }

    async updateById(accountId, { username, password, timeLastActive, firstName, lastName, email, gender, address, avatar }) {
        // [PATCH] /api/account/:id
        return (await this.api.patch(`/account/${accountId}`, {
            username: username,
            password: password,
            timeLastActive: timeLastActive,
            firstName: firstName,
            lastName: lastName,
            email: email,
            gender: gender,
            address: address,
            avatar: avatar
        })).data
    }

    async suggestAccount(accId) {
        // [GET] /api/account/:id/suggest
        return (await this.api.get(`/account/${accId}/suggest`)).data
    }
}

export default (new AccountService())