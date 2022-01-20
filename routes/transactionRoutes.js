const router = require('express').Router();
const transactionController = require('../controllers/transactionController')
const verifyToken = require('../middleware/verifyToken')
const { authorizationTrans } = require('../middlewares/authTransaction')

router.post('/transactions', verifyToken, transactionController.createTransaction);
router.get('/transactions/user', verifyToken, transactionController.getTransUser);
router.get('/transactions/admin', verifyToken, userAuthorization, transactionController.getTransAdmin);
router.get('/transactions/:transactionId', verifyToken, authorizationTrans, transactionController.getTransId);
module.exports = router