module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define('Product', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        title: {
            allowNull: false,
            type: DataTypes.STRING,
            validate: {
                notNull: {
                    msg: "field 'title' is required"
                }
            }
        },
        price: {
            allowNull: false,
            type: DataTypes.INTEGER,
            validate: {
                notNull: {
                    msg: "field 'price' is required"
                },
                isNumeric: {
                    msg: "'price' value should be number"
                },
                min: {
                    args: [0],
                    msg: "'price' value cannot be lower than 0"
                },
                max: {
                    args: [50000000],
                    msg: "'price' value cannot be greater than 50000000"
                } 
            }
        },
        stock: {
            allowNull: false,
            type: DataTypes.INTEGER,
            validate: {
                notNull: {
                    msg: "field 'stock' is required"
                },
                isNumeric: {
                    msg: "'stock' value should be number"
                },
                min: {
                    args: [5],
                    msg: "'stock' value cannot be lower than 5"
                }
            }
        },
        CategoryId: {
            allowNull: false,
            type: DataTypes.INTEGER,
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
        tableName: 'Products'
    })

    Product.associate = models => {
        Product.belongsTo(models.Category, {foreignKey: "CategoryId"});
        Product.hasMany(models.Transaction, {foreignKey: "ProductId"});
    }

    return Product;
}