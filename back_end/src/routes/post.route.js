const postController = require('../controllers/post.controller')
const express = require('express')
const router = express.Router()


// route: /api/post/
router.route('/')
    .get(postController.getAll)
    .post(postController.create)

// route: /api/post/:id
router.route('/:id')
    .get(postController.getById)
    .delete(postController.deleteById)


module.exports = router