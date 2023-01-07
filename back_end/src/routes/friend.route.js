const express = require('express')
const router = express.Router()

const friendController = require('../controllers/friend.controller')

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


module.exports = router