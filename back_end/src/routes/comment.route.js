const commentController = require('../controllers/comment.controller')
const express = require('express')
const router = express.Router()


// route: /api/comment/
router.route('/')
    .get(commentController.getAll)
    .post(commentController.create)

// route: /api/comment/:id
router.route('/:id')
    .get(commentController.getById)
    .delete(commentController.deleteById)


module.exports = router