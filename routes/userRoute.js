const router = require('express').Router()
const controller = require('../controllers/userController')
const verifyToken = require('../middleware/verifyToken')

router.post('/register', controller.register)
router.post('/login', controller.login)
router.put('/:userId', verifyToken, controller.edit)
router.delete('/:userId', verifyToken, controller.delete)
router.patch('/topup', verifyToken, controller.topup)

module.exports = router