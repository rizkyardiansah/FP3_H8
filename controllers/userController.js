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

exports.edit = async (req, res) => {
    const {userId} = req.params
    const {full_name:newFullName, email:newEmail} = req.body

    try {
        const user = await User.findByPk(userId)

        // cek apakah user dengan id tersebut ditemukan
        if (user == null) {
            //jika user tidak ditemukan maka tampilkan error 404
            return res.status(404).json({
                status: 'Not Found',
                message: 'User not found'
            })
        }

        const newUser = await user.set({
            full_name: newFullName,
            email: newEmail,
            password: user.password,
            gender: user.gender,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: new Date(),
        })

        const result = await newUser.save()

        return res.status(200).json({
            user: {
                id: result.id,
                full_name: result.full_name,
                email: result.email,
                createdAt: result.createdAt,
                updatedAt: result.updatedAt
            }
        })
    } catch (error) {
        //untuk menampilkan error
        return res.status(500).json({
            status: 'Server Error',
            message: error.message
        })
    }
}

exports.delete = async (req, res) => {
    const {userId} = req.params

    try {
        const user = await User.findByPk(userId)

        if (user == null) {
            return res.status(404).json({
                status: 'Not Found',
                message: 'User not found'
            })
        }

        const result = await User.destroy({where: {id: userId}})
        if (result == 1) {
            return res.status(200).json({message: "Your account has been successfully deleted"})
        }
    } catch (error) {
        //untuk menampilkan error
        return res.status(500).json({
            status: 'Server Error',
            message: error.message
        })
    }
}