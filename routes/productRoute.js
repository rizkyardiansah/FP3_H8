const router = require('express').Router();
const controller = require('../controllers/productController')
const verifyToken = require('../middleware/verifyToken')

router.post('/', verifyToken, controller.add)
router.get('/', verifyToken, controller.show)
module.exports = router;