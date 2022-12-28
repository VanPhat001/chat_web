const accountController = require('../controllers/account.controller')
const express = require('express')
const router = express.Router()

// route: /api/account/
router.route('/')
    .get(accountController.findAll)
    // [POST] ==> req.body = { username, password, firstName, lastName, email, avatar }
    .post(accountController.create)

// route: /api/account/:id
router.route('/:id')
    .get(accountController.getById)    
    // [UPDATE] ==> req.body = { username, password, timeLastActive, firstName, lastName, email, gender, address, avatar }
    .patch(accountController.update)
    .delete(accountController.delete)

// route: /api/account/usr/:username/pwrd/:password
router.route('/usr/:username/pwrd/:password')
    .get(accountController.findByUsernameAndPassword)

module.exports = router