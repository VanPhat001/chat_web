const accountController = require('../controllers/account.controller')
const express = require('express')
const router = express.Router()

// route: /api/account/
router.route('/')
    .get(accountController.findAll)
    .post(accountController.create)

// route: /api/account/:id
router.route('/:id')
    .get(accountController.getById)
    .patch(accountController.update)
    .delete(accountController.delete)

// route: /api/account/text/:text
router.route('/text/:text')
    .get(accountController.findByNameOrId)

// route: /api/account/usr/:username/pwrd/:password
router.route('/usr/:username/pwrd/:password')
    .get(accountController.findByUsernameAndPassword)

module.exports = router