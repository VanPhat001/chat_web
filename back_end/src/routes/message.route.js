const messageController = require('../controllers/message.controller')
const express = require('express')
const router = express.Router()


// route: /api/message/
router.route('/')
    .get(messageController.findAll)
    // [POST] ==> req.body = { sender, receipient, content }
    .post(messageController.create)

// route: /api/message/:id
router.route('/:id')
    .get(messageController.findById)
    .delete(messageController.deleteById)

// route: /api/message/acc/:id1/:id2
router.route('/acc/:id1/:id2')
    .get(messageController.findMessageByAccountId)

// route: /api/message/:id/friends
router.route('/:id/friends')
    .get(async (req, res, next) => {
        try {
            const { id } = req.params
            const MessageService = require('../services/message.service')
            const messageService = new MessageService()
            const data = await messageService.getFriendsChat(id)

            const friendsChatSet = new Set()            
            data.forEach(objElement => {
                if (objElement._id.sender == id) {
                    friendsChatSet.add(objElement._id.receipient)
                }
                else {
                    friendsChatSet.add(objElement._id.sender)
                }
            })

            const friendsChatArray = [...friendsChatSet]            
            console.log('>> get friends chat')
            res.send(friendsChatArray)
        } catch (error) {
            next(error)
        }
    })


module.exports = router