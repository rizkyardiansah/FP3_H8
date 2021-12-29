const { User } = require('../models')
const bcrypt = require('bcrypt')
const rupiahFormatter = require('../utils/rupiahFormatter')
const jwt = require('jsonwebtoken')
const jwtSecret = process.env.JWT_SECRET_KEY

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
        //jika terjadi error, tampilkan respon error
        const err = error.errors
        const errorList = err.map(d => {
            let obj = {}
            obj[d.path] = d.message
            return obj;
        })

        return res.status(400).json({
            status: 'error',
            message: errorList
        });
    })
}

exports.login = async (req, res) => {
    const {email, password} = req.body

    try {
        const user = await User.findOne({where: {email: email} })

        // cek apakah user dengan email tersebut ditemukan
        if (user == null) {
            //jika user tidak ditemukan maka tampilkan error 401
            res.status(401).json({
                status: 'Unauthorized',
                message: 'Email or Password is not correct'
            })
        }

        const compareResult = await bcrypt.compare(password, user.dataValues.password)
        //cek apakah email dah password cocok
        if (compareResult == false) {
            //jika password salah maka tampilkan error 401
            res.status(401).json({
                status: 'Unauthorized',
                message: 'Email or Password is not correct'
            })
        }

        //data yang akan disimpan di jwt
        const payload = {
            id: user.dataValues.id
        }

        //membuat token jwt
        const token = await jwt.sign(payload, jwtSecret) 
        //mengirimkan token jwt
        res.status(200).json({
            jwt: token
        })
    } catch (error) {
        //untuk menampilkan error
        res.status(500).json({
            status: 'Server Error',
            message: error.message
        })
    }
}