const commentController = require('../controllers/comment.controller')
const express = require('express')
const CommentService = require('../services/comment.service')
const router = express.Router()


// route: /api/comment/
router.route('/')
    .get(commentController.getAll)
    .post(commentController.create)

router.route('/many')
    .post(async (req, res, next) => {
        try {
            const { idList } = req.body

            const commentService = new CommentService()
            const data = await commentService.getMany(idList)

            console.log('>> get many comments')
            res.send(data)
        } catch (error) {
            next(error)
        }
    })

// route: /api/comment/:id
router.route('/:id')
    .get(commentController.getById)
    .delete(commentController.deleteById)


module.exports = router