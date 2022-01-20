module.exports = (sequelize, DataTypes) => {
  const Transactions = sequelize.define('Transactions', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    quantity: {
      allowNull: false,
      type: DataTypes.INTEGER,
      validate: {
        notNull: {
          msg: 'Quantity tidak boleh kosong'
        },
        isInt: {
          args: true,
          msg: 'Quantity hanya boleh bertipe integer'
        }
      }
    },
    total_price: {
      allowNull: false,
      type: DataTypes.INTEGER,
      validate: {
        notNull: {
          msg: 'Harga total tidak boleh kosong'
        },
        isInt: {
          args: true,
          msg: 'Harga hanya boleh bertipe integer'
        }
      }
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    tableName: 'TransactionHistory'
  })

  Transactions.associate = models => {
    Transactions.belongsTo(models.Product, {
      foreignKey: 'ProductId'
    })
    Transactions.belongsTo(models.User, {
      foreignKey: 'UserId'
    })
  }
  return Transactions;
}