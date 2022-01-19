const router = require('express').Router()
const controller = require('../controllers/categoryController')
const verifyToken = require('../middleware/verifyToken')

router.post('/',verifyToken, controller.create)
router.get('/',verifyToken, controller.show)
router.patch('/:id',verifyToken, controller.patch)
router.delete('/:id',verifyToken, controller.delete)

module.exports = router