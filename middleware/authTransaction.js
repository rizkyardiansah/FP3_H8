const jwt = require("jsonwebtoken");
const {Transaction} = require('../models')
require('dotenv').config();

function authorizationTrans(req, res, next) {
  const authHeader = req.headers['x-access-token']
  if (authHeader == null) return res.status(401).send({
    message: 'Unauthorized',
    status: false
  })
  let encoded = jwt.verify(authHeader, process.env.JWT_SECRET_KEY)
  Transaction.findOne({
    where: {UserId: encoded.id}
  })
  .then(data => {
    if(data || encoded.role == 1) {
      next()
    } else {
      return res.sendStatus(401).send({
        message: 'Unauthorized',
        status: false
      })
    }
  })
}
module.exports = {authorizationTrans};