const { User } = require('../models')
const bcrypt = require('bcrypt')
const rupiahFormatter = require('../utils/rupiahFormatter')
const jwt = require('jsonwebtoken')
const jwtSecret = process.env.JWT_SECRET_KEY

exports.register = (req, res) => {
    //melakukan object destructuring untuk mendapatkan data yang diinginkan
    const {full_name, password, gender, email} = req.body

    //membuat hook 'beforeValidate' untuk menyimpan nilai default dari user
    User.beforeValidate(async (user, options) => {
        user.balance = 0;
        user.role = 'costumer';
        user.createdAt = new Date();
        user.updatedAt = new Date();
    })

    //membuat hook 'afterValidate' untuk menyimpan password yang telah dihash
    User.afterValidate( async (user, options) => {
        user.password = await bcrypt.hash(user.password, 10)
    })

    try {
        //membuat user
        const user = await User.create({full_name, password, gender, email})
        //mengembalikan data user
        return res.status(201).json({
            user: {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                gender: user.gender,
                balance: rupiahFormatter(user.balance),
                createdAt: user.createdAt,
            }
        })
    } catch (error) {
        // jika terjadi error sequelize terjadi
        // maka tampilkan respon error
        if (error.name === "SequelizeValidationError") {
            const err = error.errors
            const errorList = err.map(d => {
                let obj = {}
                obj[d.path] = d.message
                return obj;
            })
    
            return res.status(400).json({
                status: 'Data Error',
                message: errorList
            });
        }
    
        //jika terjadi server error
        //maka kembalikan respon tersebut
        return res.status(500).json({
            status: 'Server Error',
            message: error.message
        })
    }
}

exports.login = async (req, res) => {
    const {email, password} = req.body

    try {
        const user = await User.findOne({where: {email: email} })

        // cek apakah user dengan email tersebut ditemukan
        if (user == null) {
            //jika user tidak ditemukan maka tampilkan error 401
            return res.status(401).json({
                status: 'Unauthorized',
                message: 'Email or Password is not correct'
            })
        }

        const compareResult = await bcrypt.compare(password, user.dataValues.password)
        //cek apakah email dah password cocok
        if (compareResult == false) {
            //jika password salah maka tampilkan error 401
            return res.status(401).json({
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
        return res.status(200).json({
            jwt: token
        })
    } catch (error) {
        //untuk menampilkan error
        return res.status(500).json({
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