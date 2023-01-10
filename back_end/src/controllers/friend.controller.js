const FriendService = require('../services/friend.service')

// [GET] /api/friend/
exports.getAll = async (req, res, next) => {
    try {
        const friendService = new FriendService()

        const friends = await friendService.getAll()

        console.log('>> get all friends')
        res.send(friends)
    } catch (error) {
        next(error)
    }
}

// [POST] /api/friend/
exports.create = async (req, res, next) => {
    try {
        const friendService = new FriendService()

        const { accountId1, accountId2 } = req.body
        const data = await friendService.create(accountId1, accountId2)

        console.log('>> create friend')
        res.send(data)
    } catch (error) {
        next(error)
    }
}

// [DELETE] /api/friend/:id
exports.delete = async (req, res, next) => {
    try {
        const friendService = new FriendService()
        
        const data = await friendService.delete(req.params.id)
    
        console.log('>> delete friend')
        res.send(data)
    } catch (error) {
        next(error)
    }
}


// [GET] /api/friend/accountId/:id
exports.getAllFriendsOfAccount = async (req, res, next) => {
    const friendService = new FriendService()

    const accId = req.params.id
    const friendsData = await friendService.getByAccountId(accId, true)

    const friends = []
    friendsData.forEach(friend => {
        if (friend.accountId1 == accId) {
            friends.push(friend.accountId2)
        }
        else {
            friends.push(friend.accountId1)
        }
    })


    console.log('>> get friends by accountId')
    res.send(friends)
}