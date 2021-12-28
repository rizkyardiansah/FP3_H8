const { User } = require('../models')
const bcrypt = require('bcrypt')
const rupiahFormatter = require('../utils/rupiahFormatter')

exports.register = (req, res) => {
    const {full_name, password, gender, email} = req.body

    User.addHook('afterValidate', async (user, options) => {
        user.balance = 0
        user.password = await bcrypt.hash(user.password, 10)
    })

    User
    .create({
        full_name,
        email,
        password,
        gender,
        balance: 0,
        role: 'costumer',
        createdAt: new Date(),
        udpatedAt: new Date(),
    })
    .then(result => {
        res.status(201).json({
            user: {
                id: result.dataValues.id,
                full_name: result.dataValues.full_name,
                email: result.dataValues.email,
                gender: result.dataValues.gender,
                balance: rupiahFormatter(result.dataValues.balance),
                createdAt: result.dataValues.createdAt,
            }
        })
    })
    .catch(error => {
        res.json(error)
    })
}