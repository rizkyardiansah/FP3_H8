const bcrypt = require('bcrypt')

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        full_name: {
            allowNull: false,
            type: DataTypes.STRING,
            validate: {
                notNull: {
                    msg: "field 'full_name' is required"
                }
            },
        },
        email: {
            allowNull: false,
            type: DataTypes.STRING,
            unique: {
                msg: 'Email is already used'
            },
            validate: {
                notNull: {
                    msg: "field 'email' is required"
                },
                isEmail: {
                    msg: "Email is not valid"
                }
            }
        },
        password: {
            allowNull: false,
            type: DataTypes.STRING,
            validate: {
                notNull: {
                    msg: "field 'password' is required"
                },
                len: {
                    args: [6, 10],
                    msg: "'password' length is 6-10"
                }
            }
        },
        gender: {
            allowNull: false,
            type: DataTypes.STRING,
            validate: {
                notNull: {
                    msg: "field 'gender' is required"
                },
                isIn: {
                    args: [['male', 'female']],
                    msg: "'gender' value should be either 'female' or 'male'"
                }
            }
        },
        role: {
            allowNull: false,
            type: DataTypes.STRING,
            validate: {
                notNull: {
                    msg: "field 'role' is required"
                },  
                isIn: {
                    args: [['admin', 'costumer']],
                    msg: "'role' value should be either 'admin' or 'costumer'"
                }                    
            }
        },
        balance: {
            allowNull: false,
            type: DataTypes.INTEGER,
            validate: {
                notNull: {
                    msg: "field 'balance' is required"
                },
                isNumeric: {
                    msg: "'balance' value should be number"
                },
                max: {
                    args: [100000000],
                    msg: "'balance' value cannot be greated than 100000000"
                },
                min: {
                    args: [0],
                    msg: "'balance' value cannot be lower than 0"
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
        tableName: 'Users',
        hooks: {
            afterValidate: async function(user) {
                user.password = await bcrypt.hash(user.password, 10);
            },

            beforeValidate: function(user) {
                user.role = 'costumer';
                user.createdAt = new Date();
                user.updatedAt = new Date();
            },
            beforeUpdate: function(user) {
                user.updatedAt = new Date();
            }
        }
    })

    User.associate = models => {
        User.hasMany(models.Transaction, {foreignKey: 'UserId'});
    }

    return User;
}