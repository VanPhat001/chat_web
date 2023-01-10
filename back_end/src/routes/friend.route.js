const express = require('express')
const router = express.Router()

const friendController = require('../controllers/friend.controller')

const FriendService = require('../services/friend.service')


// route: /api/friend/
router.route('/')
    .get(friendController.getAll)
    .post(friendController.create)

// route: /api/friend/:id
router.route('/:id')
    .delete(friendController.delete)

// route: /api/friend/accountId/:id
router.route('/accountId/:id')
    .get(friendController.getAllFriendsOfAccount)

// route: /api/friend/acc1/:accountId1/acc2/:accountId2
router.route('/acc1/:accountId1/acc2/:accountId2')
    .delete(async (req, res, next) => {
        try {
            const friendService = new FriendService()

            const { accountId1, accountId2 } = req.params
            const data = await friendService.deleteByAccount(accountId1, accountId2)

            console.log('>> delete friend by account');
            res.send(data)
        } catch (error) {
            next(error)
        }
    })
    .patch(async (req, res, next) => {
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
    })
    .get(async (req, res, next) => {
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
    })

// route: /api/friend/request-to/:id
router.route('/request-to/:id')
    .get(async (req, res, next) => {
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
    })



module.exports = router