const AccountService = require('../services/account.service')


// [GET] /api/account/
exports.findAll = async (req, res, next) => {
    try {
        const accountService = new AccountService()
        const accounts = await accountService.getAll()

        console.log('>> get all accounts')
        res.send(accounts)
    } catch (error) {
        next(error)
    }
}

// [POST] /api/account/
exports.create = async (req, res, next) => {
    try {
        const accountService = new AccountService()
        const { username, password, firstName, lastName, email, avatar, background } = req.body
        const data = await accountService.create(username, password, firstName, lastName, email, avatar, background)

        console.log('>> create account')
        res.send(data)
    } catch (error) {
        next(error)
    }
}

// [GET] /api/account/:id
exports.getById = async (req, res, next) => {
    try {
        const accountService = new AccountService()
        const account = await accountService.getById(req.params.id)

        console.log('>> get account by id')
        res.send(account)
    } catch (error) {
        next(error)
    }
}

// [PATCH] /api/account/:id
exports.update = async (req, res, next) => {
    try {
        const accountService = new AccountService()
        const data = await accountService.updateById(req.params.id, req.body)

        console.log('>> [PATCH] update account')
        res.send(data)
    } catch (error) {
        next(error)
    }
}

// [DELETE] /api/account/:id
exports.delete = async (req, res, next) => {
    try {
        const accountService = new AccountService()
        const data = await accountService.deleteById(req.params.id)

        console.log('>> delete account')
        res.send(data)
    } catch (error) {
        next(error)
    }
}

// [GET] /api/account/usr/:username/pwrd/:password
exports.findByUsernameAndPassword = async (req, res, next) => {
    try {
        const { username, password } = req.params
        const accountService = new AccountService()
        const account = await accountService.findByUsernameAndPassword(username, password)

        console.log('>> get account by password and username')
        res.send(account)
    } catch (error) {
        next(error)
    }
}

// [GET] /api/account/text/:text
exports.findByNameOrId = async (req, res, next) => {
    try {
        const accountService = new AccountService()

        const text = req.params.text.trim()
        const usrList = await accountService.findByNameOrId(text)
        // usrList = {_id: ObjectId(...), name: lastName + ' ' + firstName}

        const tasks = []
        usrList.forEach(item => {
            const id = item._id.toString()
            tasks.push(accountService.getById(id))
        })

        const accounts = await Promise.all(tasks)

        console.log('>> find accounts by name or id')
        res.send(accounts)
    } catch (error) {
        next(error)
    }
}

// [POST] /api/account/many
exports.findByIdArray = async (req, res, next) => {
    const { accIdList } = req.body

    const AccountService = require('../services/account.service')
    const accountService = new AccountService()
    try {
        const data = await accountService.findByIdArray(accIdList)

        console.log('>> get many accounts')
        res.send(data)
    } catch (error) {
        next(error)
    }
}