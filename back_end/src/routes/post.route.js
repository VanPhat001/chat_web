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
    .patch(async (req, res, next) => {
        try {
            const PostService = require('../services/post.service')
            const postService = new PostService()

            const data = await postService.updateById(req.params.id, req.body)

            console.log('>> [PATCH] update post by id')
            res.send(data)
        } catch (error) {
            next(error)
        }
    })


module.exports = router