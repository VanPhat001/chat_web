const messageController = require('../controllers/message.controller')
const express = require('express')
const router = express.Router()


// route: /api/message/
router.route('/')
    .get(messageController.findAll)
    .post(messageController.create)

// route: /api/message/:id
router.route('/:id')
    .get(messageController.findById)
    .delete(messageController.deleteById)

// route: /api/message/acc/:id
router.route('/acc/:id')
    .get(messageController.findMessageByAccountId)

    
module.exports = router