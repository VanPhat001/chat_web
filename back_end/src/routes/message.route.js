const messageController = require('../controllers/message.controller')
const express = require('express')
const router = express.Router()


// route: /api/message/
router.route('/')
    .get(messageController.findAll)
    .post(messageController.create)
    .delete(async (req, res, next) => {
        try {
            const MessageService = require('../services/message.service')
            const messageService = new MessageService()

            const data = await messageService.deleteAll()

            console.log('>> delete all messages')
            res.send(data)
        } catch (error) {
            next(error)
        }
    })

// route: /api/message/:id
router.route('/:id')
    .get(messageController.findById)
    .delete(messageController.deleteById)

// route: /api/message/acc/:id1/:id2
router.route('/acc/:id1/:id2')
    .get(messageController.findMessageByAccountId)

// route: /api/message/:id/friends
router.route('/:id/friends')
    .get(messageController.getFriendsChat)

// route: /api/message/last/accounts
router.route('/last/accounts')
    .get(messageController.getLastMessageOfAllUsers)

// route: /api/message/last/acc/:id
router.route('/last/acc/:id')
    .get(messageController.getAllLastMessOfUserToFriends)

module.exports = router