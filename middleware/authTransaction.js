const jwt = require("jsonwebtoken");
const {transactionHistory} = require('../models')
require('dotenv').config();

function authorizationTrans(req, res, next) {
  const authHeader = req.headers.token
  if (authHeader == null) return res.status(401).send({
    message: 'Unauthorized',
    status: false
  })
  let encoded = jwt.verify(authHeader, process.env.SECRET_KEY)
  transactionHistorie.findOne({
    where: {user_id: encoded.id}
  })
  .then(data => {
    if(data || encoded.role == 1) {
      next()
    } else {
      res.sendStatus(401).send({
        message: 'Unauthorized',
        status: false
      })
    }
  })
}
module.exports = {authorizationTrans};