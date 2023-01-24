const postController = require('../controllers/post.controller')
const express = require('express')
const PostService = require('../services/post.service')
const router = express.Router()


// route: /api/post/
router.route('/')
    .get(postController.getAll)
    .post(postController.create)

router.route('/many')
    .post(async (req, res, next) => {
        try {
            const { idList } = req.body

            const postService = new PostService()
            const data = await postService.getMany(idList)

            console.log('>> get many posts')
            res.send(data)
        } catch (error) {
            next(error)
        }
    })

// route: /api/post/:id
router.route('/:id')
    .get(postController.getById)
    .delete(postController.deleteById)
    .patch(postController.updateById)

// route: /api/post/:id/cmt/:cmtId
router.route('/:id/cmt/:cmtId')
    .patch(postController.pushComment)


// route: /api/post/author/:id
router.route('/author/:id')
    .get(async (req, res, next) => {
        try {
            const PostService = require('../services/post.service')
            const postService = new PostService()

            const posts = await postService.getByAuthor(req.params.id)

            console.log('>> get posts by author')
            res.send(posts)
        } catch (error) {
            next(error)
        }
    })

module.exports = router