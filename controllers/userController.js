const { User } = require('../models')
const bcrypt = require('bcrypt')
const rupiahFormatter = require('../utils/rupiahFormatter')
const jwt = require('jsonwebtoken')
const jwtSecret = process.env.JWT_SECRET_KEY

exports.register = async (req, res) => {
    //melakukan object destructuring untuk mendapatkan data yang diinginkan
    const {full_name, password, gender, email} = req.body

    try {
        //membuat user
        const user = await User.create({full_name, password, gender, email, balance: 0})
        //mengembalikan data user
        return res.status(201).json({
            user: {
                id: user.dataValues.id,
                full_name: user.dataValues.full_name,
                email: user.dataValues.email,
                gender: user.dataValues.gender,
                balance: rupiahFormatter(user.dataValues.balance),
                createdAt: user.dataValues.createdAt,
            }
        })
    } catch (error) {
        // jika terjadi error sequelize terjadi
        // maka tampilkan respon error
        if (error.name.includes("Sequelize")) {
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
    //melakukan object destructuring untuk mendapatkan data yang diinginkan
    const {email, password} = req.body

    if (email === undefined || password === undefined) {
        return res.status(400).json({
            status: 'Data Error',
            message: "field 'email' and 'password' is required"
        })
    }

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
            id: user.dataValues.id,
            email: user.dataValues.email,
            gander: user.dataValues.gander,
            balance: user.dataValues.balance,
            role: user.dataValues.role
        }

        //membuat token jwt
        const token = await jwt.sign(payload, jwtSecret, { expiresIn: '1h'}) 
        //mengirimkan token jwt
        return res.status(200).json({
            jwt: token
        })
    } catch (error) {
        // jika terjadi error sequelize terjadi
        // maka tampilkan respon error
        if (error.name.includes("Sequelize")) {
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
            email: newEmail
        })

        const result = await newUser.save()

        return res.status(200).json({
            user: {
                id: result.dataValues.id,
                full_name: result.dataValues.full_name,
                email: result.dataValues.email,
                createdAt: result.dataValues.createdAt,
                updatedAt: result.dataValues.updatedAt
            }
        })
    } catch (error) {
        // jika terjadi error sequelize terjadi
        // maka tampilkan respon error
        if (error.name.includes("Sequelize")) {
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

exports.delete = async (req, res) => {
    const {userId} = req.params

    try {
        const user = await User.findByPk(userId)

        //periksa apakah user dengan userId tersebut ditemukan
        if (user == null) {
            //jika tidak maka tampilkan error not found
            return res.status(404).json({
                status: 'Not Found',
                message: 'User not found'
            })
        }

        //jika ada maka hapus data dengan id tersebut
        const result = await User.destroy({where: {id: userId}})
        //jika data berhasil dihapus
        if (result == 1) {
            //maka tampilkan respon berikut
            return res.status(200).json({message: "Your account has been successfully deleted"})
        }
    } catch (error) {
        // jika terjadi error sequelize terjadi
        // maka tampilkan respon error
        if (error.name.includes("Sequelize")) {
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

exports.topup = async (req, res) => {
    let topupBalance = String(req.body.balance);
    const {id:userId} = req.user;

    //memastikan bahwa balance hanya berisi angka
    if (topupBalance.match(/[^0-9]/)) {
        return res.status(400).json({
            status: "Data Error",
            message: "field 'balance' should only contain number"
        })
    }
    
    try {
        const user = await User.findByPk(userId);

        const newUser = await user.set({
            balance: user.dataValues.balance + Number(topupBalance)
        })

        const result = await newUser.save();

        return res.status(200).json({message: `Your balance has been successfully updated to ${rupiahFormatter(result.dataValues.balance)}`})
    } catch (error) {
        // jika terjadi error sequelize terjadi
        // maka tampilkan respon error
        if (error.name.includes("Sequelize")) {
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