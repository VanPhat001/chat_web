const PostService = require('../services/post.service')


// [GET] /api/post/
exports.getAll = async (req, res, next) => {
    try {
        const postService = new PostService()
        const posts = await postService.getAll()

        console.log('>> get all posts')
        res.send(posts)
    } catch (error) {
        next(error)
    }
}

// [POST] /api/post/
exports.create = async (req, res, next) => {
    try {
        const postService = new PostService()
        const { author, content, likes, comments } = req.body
        const data = await postService.create(author, content, likes, comments)

        console.log('>> create post')
        res.send(data)
    } catch (error) {
        next(error)
    }
}

// [GET] /api/post/:id
exports.getById = async (req, res, next) => {
    try {
        const postService = new PostService()
        const post = await postService.getById(req.params.id)

        console.log('>> get post by id')
        res.send(post)
    } catch (error) {
        next(error)
    }
}

// [DELETE] /api/post/:id
exports.deleteById = async (req, res, next) => {
    try {
        const postService = new PostService()
        const data = await postService.deleteById(req.params.id)

        console.log('>> delete post by id')
        res.send(data)
    } catch (error) {
        next(error)
    }
}

// [PATCH] /api/post/:id
exports.updateById = async (req, res, next) => {
    try {
        const postService = new PostService()

        const data = await postService.updateById(req.params.id, req.body)

        console.log('>> [PATCH] update post by id')
        res.send(data)
    } catch (error) {
        next(error)
    }
}

// [PATCH] /api/post/:id/cmt/:cmtId
exports.pushComment = async (req, res, next) => {
    try {
        const postService = new PostService()

        const data = await postService.pushComment(req.params.id, req.params.cmtId)

        console.log('>> push comment into Post.comments')
        res.send(data)
    } catch (error) {
        next(error)
    }
}