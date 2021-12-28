const { User } = require('../models')

exports.register = (req, res) => {
    const {full_name, password, gender, email} = req.body

    User
    .create({
        full_name,
        email,
        password,
        gender,
        role: 'costumer',
        balance: 0,
        createdAt: new Date(),
        udpatedAt: new Date(),
    })
    .then(result => {
        res.json(result.dataValues)
    })
    .catch(error => {
        res.json(error)
    })
}