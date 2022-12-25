const CommentService = require('../services/comment.service')


// [GET] /api/comment/
exports.getAll = async (req, res, next) => {
    try {
        const commentService = new CommentService()
        const comments = await commentService.getAll()

        console.log('>> get all comments')
        res.send(comments)
    } catch (error) {
        next(error)
    }
}

// [POST] /api/comment/
exports.create = async (req, res, next) => {
    try {
        const { accountId, image, text, comments } = req.body
        const commentService = new CommentService()
        const data = await commentService.create(accountId, image, text, comments)

        console.log('>> create comment')
        res.send(data)
    } catch (error) {
        next(error)
    }
}

// [GET] /api/comment/:id
exports.getById = async (req, res, next) => {
    try {
        const commentService = new CommentService()
        const comment = await commentService.getById(req.params.id)

        console.log('>> get comment by id')
        res.send(comment)
    } catch (error) {
        next(error)
    }
}

// [DELETE] /api/comment/:id
exports.deleteById = async (req, res, next) => {
    try {
        const commentService = new CommentService()
        const data = await commentService.deleteById(req.params.id)

        console.log('>> delete comment by id')
        res.send(data)
    } catch (error) {
        next(error)
    }
}