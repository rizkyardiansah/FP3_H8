const { Transaction: transactionHistory, Product: product, User:user, Category: categorie } = require("../models");
const { verifyToken } = require("../middleware/verifyToken");
const rupiahFormatter = require("../utils/rupiahFormatter");

class transactionController {
  static createTransaction  (req, res) {
    var { productId, quantity } = req.body;
    var totalPrice;
    var totalBalance
    quantity = Number(quantity);
    let encoded = req.user;
     user.findByPk(encoded.id).then( cariBalance => {
      totalBalance = cariBalance.balance
       product
        .findOne({
          where: { id: productId }
        })
        .then(data => {
          let status = 201;
          if (!data) {
            status = 404;
            res.status(status).send("Product not found");
          } else if (data.stock < quantity) {
            status = 400;
            res.status(status).send("Quantity is more than existing stock!");
          }
          else if (totalBalance < quantity * data.price) {
            status = 400;
            res.status(status).send("Your balance is not enough!");
          }
          else {
            product.update(
              {
                stok: data.stok - quantity
              },
              {
                where: { id: data.id }
              }
            );
            return product
              .findByPk(productId)
              .then( data => {
                totalPrice = data.price * quantity;
                //return res.json(encoded.balance);
                 user.update(
                  {
                    balance: encoded.balance - totalPrice
                  },
                  {
                    where: {
                      id: encoded.id
                    }
                  }
                );
                return data;
              })
              .then(data => {
                return  categorie.findByPk(data.CategoryId);
              })
              .then( data => {
                return categorie.update(
                  {
                    sold_product_amount: data.sold_product_amount + quantity
                  },
                  {
                    where: { id: data.id }
                  }
                );
              })
              .then( () => {
                return product.findByPk(productId);
              })
              .then(data => {
                let input = {
                  ProductId: productId,
                  UserId: encoded.id,
                  quantity: quantity,
                  total_price: totalPrice
                };
                transactionHistory.create(input);
                return data;
              })
              .then(data => {
                let output = {
                  message: "You have been successfully purchase the product",
                  transactionBill: {
                    total_price: rupiahFormatter(totalPrice),
                    quantity: quantity,
                    product_name: data.title
                  }
                };
                res.status(201).send(output);
              });
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
        });
    });
  };

  static getTransUser (req, res) {
    let encoded = req.user;
    transactionHistory
      .findAll({
        where: {
          UserId: encoded.id
        },
        include: [
          {
            model: product,
            attributes: ["id", "title", "price", "stock", "CategoryId"]
          }
        ]
      })
      .then(data => {
        let errCode = 200;
        data.map(item => {
          item.dataValues.total_price = rupiahFormatter(
            item.dataValues.total_price
          );
          item.dataValues.Product.dataValues.price = rupiahFormatter(
            item.dataValues.Product.dataValues.price
          );
        });
        if (!data) {
          errCode = 404;
          res.status(errCode).send("Transaction not found!");
        }
        res.status(errCode).json({ transactionHistory: data });
      })
      .catch(err => {
        let errCode = 500;
        if (err.name.includes("DatabaseError")) {
          console.log(err);
          errCode = 400;
        }
        console.log(err);
        res.status(errCode).json(err);
      });
  };

  static getTransAdmin (req, res) {
    transactionHistory
      .findAll({
        include: [
          {
            model: product,
            attributes: ["id", "title", "price", "stock", "CategoryId"]
          },
          {
            model: user,
            attributes: ["id", "email", "balance", "gender", "role"]
          }
        ]
      })
      .then(data => {
        let errCode = 200;
        console.log(data);
        data.map(item => {
          item.dataValues.total_price = rupiahFormatter(
            item.dataValues.total_price
          );
          item.dataValues.Product.dataValues.price = rupiahFormatter(
            item.dataValues.Product.dataValues.price
          );
          item.dataValues.User.dataValues.balance = rupiahFormatter(
            item.dataValues.User.dataValues.balance
          );
        });
        if (!data) {
          errCode = 404;
          res.status(errCode).send("Transaction not found!");
        }
        data.map(item => {
          if (item.dataValues.User.role == 1) {
            item.dataValues.User.role = "admin";
          } else {
            item.dataValues.User.role = "user";
          }
        });
        res.status(errCode).send({ transactionHistory: data });
      })
      .catch(err => {
        let errCode = 500;
        if (err.name.includes("DatabaseError")) {
          console.log(err);
          errCode = 400;
        }
        console.log(err);
        res.status(errCode).json(err);
      });
  };

  static getTransId (req, res) {
    transactionHistory
      .findOne({
        where: { id: req.params.transactionId },
        include: {
          model: product,
          attributes: ["id", "title", "price", "stock", "CategoryId"]
        }
      })
      .then(data => {
        let errCode = 200;
        if (!data) {
          errCode = 404;
          res.status(errCode).send("Transaction not found!");
        }
        data.total_price = rupiahFormatter(data.total_price);
        data.Product.price = rupiahFormatter(data.Product.price);
        res.status(errCode).send({ transactionHistory: data });
      })
      .catch(err => {
        let errCode = 500;
        if (err.name.includes("DatabaseError")) {
          console.log(err);
          errCode = 400;
        }
        console.log(err);
        res.status(errCode).json(err);
      });
  };
}

module.exports = transactionController;