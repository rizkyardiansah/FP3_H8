const { transactionHistory, product, user, categorie } = require('../models');
const { verifyToken } =  require('../helpers/jwt');
const rupiahFormat = require('../utils/rupiahFormat');

class transactionController {
  static createTransaction(req, res) {
    let { productId, quantity } = req.body;
    quantity = Number(quantity);
    let encoded = verifyToken(req.headers.token);
    product.findOne({
      where: { id: productId}
    })
    .then(data => {
      let status = 201;
        if (!data) {
          status = 404;
          res.status(status).send('Product not found');
        }
        else if(data.stock < quantity) {
          status = 400;
          res.status(status).send('Quantity is more than existing stock!')
        }
        else if(encoded.balance < quantity*data.price) {
          status = 400;
          res.status(status).send('Your balance is not enough!')
        }
        else {
          product.update(
            {
              stok: data.stok - quantity
            },
            {
              where: {id: data.id},
            },
          )
          return product.findByPk(productId)
          .then((data) => {
            user.update(
              {
                balance: encoded.balance - data.price
              },
              {
                where: {
                  id: encoded.id
                }
              }
            )
            return data;
          })
          .then((data) => {
            return categorie.findByPk(data.CategoryId)
          })
          .then((data) => {
             return categorie.update(
              {
                sold_product_amount: data.sold_product_amount + quantity
              },
              {
                where: {id: data.id}
              }
            )
          })
          .then(() => {
            return product.findByPk(productId)
          })
          .then((data) => {
            let input = {
              product_id: productId,
              user_id: encoded.id,
              quantity: quantity,
              total_price: data.price
            }
            transactionHistory.create(input)
            return data;
          })
          .then((data) => {
             let output = { 
               message: 'You have been successfully purchase the product',
               transactionBill: {
                 total_price: rupiahFormat(data.price),
                 quantity: quantity,
                 product_name: data.title
                 }
            }
            res.status(201).send(output)
          })
        }
    })
    .catch(err => {
      let errCode = 500;
       if (err.name.includes("DatabaseError")) {
          console.log(err);
          errCode = 400;
       }
      console.log(err);
      res.status(errCode).json(err);
    })
  }

  static getTransUser (req, res) {
    let encoded = verifyToken(req.headers.token);
    transactionHistory.findAll({
      where: {
        user_id: encoded.id
      },
      include: [
        {
          model: product,
          attributes: ['id', 'title', 'price', 'stok', 'CategoryId']
        }
      ]
    })
    .then(data => {
      let errCode = 200;
      data.map(item => {
        item.dataValues.total_price = rupiahFormat(item.dataValues.total_price);
        item.dataValues.product.dataValues.price = rupiahFormat(item.dataValues.product.dataValues.price);
      });
      if (!data) {
        errCode = 404;
        res.status(errCode).send('Transaction not found!');
      }
      res.status(errCode).json({transactionHistory: data});
    })
    .catch(err => {
      let errCode = 500;
        if (err.name.includes("DatabaseError")) {
          console.log(err);
          errCode = 400;
        }
        console.log(err);
        res.status(errCode).json(err);
    })
  }

  static getTransAdmin  (req, res)  {
    transactionHistory.findAll({
      include: [
        {
          model: product,
          attributes: ['id', 'title', 'price', 'stok', 'CategoryId']
        },
        {
          model: user,
          attributes: ['id', 'email', 'balance', 'gender', 'role']
        }
      ]
    })
    .then(data => {
      let errCode = 200;
      console.log(data)
      data.map(item => {
        item.dataValues.total_price = rupiahFormat(item.dataValues.total_price);
        item.dataValues.product.dataValues.price = rupiahFormat(item.dataValues.product.dataValues.price);
        item.dataValues.user.dataValues.balance = rupiahFormat(item.dataValues.user.dataValues.balance);
      });
      if (!data) {
        errCode = 404;
        res.status(errCode).send('Transaction not found!');
      }
      data.map(item => {
        if(item.dataValues.user.role == 1) {
          item.dataValues.user.role = 'admin'
        } else {
          item.dataValues.user.role = 'user'
        }
      });
      res.status(errCode).send({transactionHistory: data});
    })
    .catch(err => {
      let errCode = 500;
        if (err.name.includes("DatabaseError")) {
          console.log(err);
          errCode = 400;
        }
        console.log(err);
        res.status(errCode).json(err);
    })
  }

  static getTransId (req, res)  {
    transactionHistory.findOne({
      where: {id: req.params.transactionId},
      include: {
        model: product,
        attributes: ['id', 'title', 'price', 'stok', 'CategoryId']
      }
    })
    .then(data => {
      let errCode = 200;
      if (!data) {
        errCode = 404;
        res.status(errCode).send('Transaction not found!');
      }
      data.total_price = rupiahFormat(data.total_price);
      data.product.price = rupiahFormat(data.product.price);
      res.status(errCode).send({transactionHistories: data});
    })
    .catch(err => {
      let errCode = 500;
        if (err.name.includes("DatabaseError")) {
          console.log(err);
          errCode = 400;
        }
        console.log(err);
        res.status(errCode).json(err);
    })
  }
}

module.exports = transactionController;