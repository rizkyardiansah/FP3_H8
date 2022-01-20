const router = require('express').Router();
const transactionController = require('../controllers/transactionController')
const verifyToken = require('../middleware/verifyToken')
const { authorizationTrans } = require('../middlewares/authTransaction')

router.post('/', verifyToken, transactionController.createTransaction);
router.get('/user', verifyToken, transactionController.getTransUser);
router.get('/admin', verifyToken, userAuthorization, transactionController.getTransAdmin);
router.get('/:transactionId', verifyToken, authorizationTrans, transactionController.getTransId);
module.exports = router