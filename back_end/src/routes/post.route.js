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
    .patch(postController.updateById)

// route: /api/post/:id/cmt/:cmtId
router.route('/:id/cmt/:cmtId')
    .patch(postController.pushComment)


module.exports = router