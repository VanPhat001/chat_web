const MessageService = require('../services/message.service')

// [GET] /api/message/
exports.findAll = async (req, res, next) => {
    try {
        const messageService = new MessageService()
        const messages = await messageService.getAll()

        console.log('>> get all messages')
        res.send(messages)
    } catch (error) {
        next(error)
    }
}

// [POST] /api/message/
exports.create = async (req, res, next) => {
    try {
        const { sender, receipient, content } = req.body
        const messageService = new MessageService()
        const data = await messageService.create(sender, receipient, content)

        console.log('>> create message');
        res.send(data)
    } catch (error) {
        next(error)
    }
}

// [GET] /api/message/:id
exports.findById = async (req, res, next) => {
    try {
        const messageService = new MessageService()
        const message = await messageService.getById(req.params.id)

        console.log('>> find message by id')
        res.send(message)            
    } catch (error) {
        next(error)
    }
}

// [DELETE] /api/message/:id
exports.deleteById = async (req, res, next) => {
    try {
        const messageService = new MessageService()
        const data = await messageService.deleteById(req.params.id)
        
        console.log('>> delete message')
        res.send(data)
    } catch (error) {
        next(error)
    }
}

// [GET] /api/message/acc/:id
exports.findMessageByAccountId = async (req, res, next) => {
    try {
        const messageService = new MessageService()
        const messages = await messageService.findByAccount(req.params.id)

        console.log('>> get messages by accountId')
        res.send(messages)
    } catch (error) {
        next(error)
    }
}