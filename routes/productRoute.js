const router = require('express').Router();
const controller = require('../controllers/productController')
const verifyToken = require('../middleware/verifyToken')

router.post('/', verifyToken, controller.add)
router.get('/', verifyToken, controller.show)
router.put('/:productId', verifyToken, controller.edit)
router.patch('/:productId', verifyToken, controller.editCategoryId)
module.exports = router;