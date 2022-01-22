module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define('Category', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        }, 
        type: {
            allowNull: false,
            type: DataTypes.STRING,
            validate: {
                notNull: {
                    msg: "field 'type' is required"
                }
            }
        },
        sold_product_amount: {
            allowNull: false,
            type: DataTypes.INTEGER,
            validate: {
                notNull: {
                    msg: "field 'sold_product_amount' is required"
                },
                isNumeric: {
                    msg: "'sold_product_amount' value should be number"
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
        tableName: 'Categories',
        hooks: {
            beforeValidate: function(category) {
                category.sold_product_amount = 0;
            }
        }
    })

    Category.associate = models => {
        Category.hasMany(models.Product, {foreignKey: 'CategoryId'})
    }

    return Category;
}