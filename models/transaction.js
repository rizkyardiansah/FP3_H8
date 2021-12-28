module.exports = (sequelize, DataTypes) => {
    const Transaction = sequelize.define('Transaction', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        ProductId: {
            allowNull: false,
            type: DataTypes.INTEGER,
        },
        UserId: {
            allowNull: false,
            type: DataTypes.INTEGER,
        },
        quantity: {
            allowNull: false,
            type: DataTypes.INTEGER,
            validate: {
                notNull: {
                    msg: "field 'quantity' is required"
                },
                isNumeric: {
                    msg: "'quantity' value should be number"
                }
            }
        },
        total_price: {
            allowNull: false,
            type: DataTypes.INTEGER,
            validate: {
                notNull: {
                    msg: "field 'total_price' is required"
                },
                isNumeric: {
                    msg: "'total_price' value should be number"
                }
            }
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE,
        },
        updatedAt: {
            allowNull: false,
            type: DataTypes.DATE,
        }
    }, {
        tableName: "TransactionHistory"
    })

    Transaction.associate = models => {
        Transaction.belongsTo(models.User, {foreignKey: 'UserId'});
        Transaction.belongsTo(models.Product, {foreignKey: 'ProductId'});
    }

    return Transaction;
}