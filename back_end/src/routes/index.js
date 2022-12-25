const accountRouter = require('./account.route')
const commentRouter = require('./comment.route')
const messageRouter = require('./message.route')
const postRouter = require('./post.route')
const express = require('express')

const router = express.Router()


router.use('/account', accountRouter)
router.use('/comment', commentRouter)
router.use('/message', messageRouter)
router.use('/post', postRouter)


module.exports = router