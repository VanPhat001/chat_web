const express = require('express')
const router = express.Router()

const friendController = require('../controllers/friend.controller')
const FriendService = require('../services/friend.service')


// route: /api/friend/
router.route('/')
    .get(friendController.getAll)
    .post(friendController.create)

router.route('/many')
    .post(async (req, res, next) => {
        try {
            const { idList } = req.body
            const friendService = new FriendService()
            const data = await friendService.findMany(idList)

            console.log('>> get many friends')
            res.send(data)
        } catch (error) {
            next(error)
        }
    })

// route: /api/friend/:id
router.route('/:id')
    .delete(friendController.delete)

// route: /api/friend/accountId/:id
router.route('/accountId/:id')
    .get(friendController.getAllFriendsOfAccount)

// route: /api/friend/acc1/:accountId1/acc2/:accountId2
router.route('/acc1/:accountId1/acc2/:accountId2')
    .get(friendController.findOneFriend)
    .delete(friendController.deleteByAccount)
    .patch(friendController.updatedByAccount)

// route: /api/friend/request-to/:id
router.route('/request-to/:id')
    .get(friendController.findFriendList)

// route: /api/friend/mutual-friends/:accId1/:accId2
router.route('/mutual-friends/:accId1/:accId2')
    .get(friendController.findMutualFriendList)


module.exports = router