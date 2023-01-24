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

// [DELETE] /api/friend/acc1/:accountId1/acc2/:accountId2
exports.deleteByAccount = async (req, res, next) => {
    try {
        const friendService = new FriendService()

        const { accountId1, accountId2 } = req.params
        const data = await friendService.deleteByAccount(accountId1, accountId2)

        console.log('>> delete friend by account');
        res.send(data)
    } catch (error) {
        next(error)
    }
}

// [PATCH] /api/friend/acc1/:accountId1/acc2/:accountId2
exports.updatedByAccount = async (req, res, next) => {
    try {
        const friendService = new FriendService()

        const { accountId1, accountId2 } = req.params
        const { isAccept } = req.body
        const data = await friendService.updatedByAccount(accountId1, accountId2, isAccept)

        console.log('>> delete friend by account');
        res.send(data)
    } catch (error) {
        next(error)
    }
}

// [GET] /api/friend/acc1/:accountId1/acc2/:accountId2
exports.findOneFriend = async (req, res, next) => {
    try {
        const { accountId1, accountId2 } = req.params

        const friendService = new FriendService()
        const data = await friendService.Friend.findOne({
            $or: [
                {
                    accountId1: accountId1,
                    accountId2: accountId2
                },
                {
                    accountId1: accountId2,
                    accountId2: accountId1
                }
            ]
        })

        console.log('>> get friend by accountId1 & accountId2');
        res.send(data)
    } catch (error) {
        next(error)
    }
}

// [GET]: /api/friend/request-to/:id
exports.findFriendList = async (req, res, next) => {
    try {
        const friendService = new FriendService()

        const data = await friendService.Friend.find({
            accountId2: req.params.id,
            isAccept: false
        }).toArray()

        const requests = []
        data.forEach(element => {
            requests.push(element.accountId1)
        })

        console.log('>> get friend requests to')
        res.send(requests)
    } catch (error) {
        next(error)
    }
}

// [GET] /api/friend/mutual-friends/:accId1/:accId2
exports.findMutualFriendList = async (req, res, next) => {
    try {
        const friendService = new FriendService()
        const { accId1, accId2 } = req.params

        let promises = Promise.all([
            friendService.getByAccountId(accId1, true),
            friendService.getByAccountId(accId2, true)
        ])
        const [friendObjOfAcc1, friendObjOfAcc2] = await promises

        const getFriends = async function (friendObj, accId) {
            const friendList = []
            friendObj.forEach(({ accountId1, accountId2 }) => {
                friendList.push(
                    accountId1 == accId ? accountId2 : accountId1
                )
            })
            return friendList
        }

        promises = Promise.all([
            getFriends(friendObjOfAcc1, accId1),
            getFriends(friendObjOfAcc2, accId2)
        ])
        const [friendOfAcc1, friendOfAcc2] = await promises

        const set = new Set(friendOfAcc1)
        const result = []
        friendOfAcc2.forEach(accId => {
            if (set.has(accId)) {
                result.push(accId)
            }
        })

        console.log('>> get mutual friends');
        res.send(result)

    } catch (error) {
        next(error)
    }
}