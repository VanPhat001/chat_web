import config from '../config'
import axios from 'axios'

class FriendService {
    constructor() {
        this.api = axios.create({
            baseURL: config.axiosURL
        })
    }

    async create(accountId1, accountId2) {
        // [POST] /api/friend/
        return (await this.api.post('/friend', {
            accountId1: accountId1,
            accountId2: accountId2
        })).data
    }

    async getAll() {
        return (await this.api.get('/friend')).data
    }

    async getAllFriendOfAccount(accId) {
        return (await this.api.get(`/friend/accountId/${accId}`)).data
    }

    async getAllAddFriendRequest(toAccId) {
        // [GET] /api/friend/request-to/:id
        return (await this.api.get(`/friend/request-to/${toAccId}`)).data
    }

    // async deleteById() {

    // }
    
    async getByAccount(accountId1, accountId2) {
        // [GET] /api/friend/acc1/:accountId1/acc2/:accountId2
        // không phân biệt thứ tự acc1 và acc2
        return (await this.api.get(`/friend/acc1/${accountId1}/acc2/${accountId2}`)).data
    }

    async deleteByAccount(accId1, accId2) {
        // [DELETE] /api/friend/acc1/:accountId1/acc2/:accountId2
        return (await this.api.delete(`/friend/acc1/${accId1}/acc2/${accId2}`)).data
    }

    async updateByAccount(accId1, accId2, isAccept) {
        // [PATCH] /api/friend/acc1/:accountId1/acc2/:accountId2
        return (await this.api.patch(`/friend/acc1/${accId1}/acc2/${accId2}`, {
            isAccept: isAccept
        })).data
    }
}

export default new FriendService()