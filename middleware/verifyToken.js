const jwt = require('jsonwebtoken')
const jwtSecret = process.env.JWT_SECRET_KEY

module.exports = async (req, res, next) => {
    const token = req.headers['x-access-token']

    //cek apakah ada token
    if (!token) {
       return res.status(403).json({
            status: 'Forbidden',
            message: 'Access token required'
        })
    }

    try {
        const user = jwt.verify(token, jwtSecret)
        req.user = user
        return next()
    } catch (error) {
        return res.status(500).json({
            status: 'Server Error',
            message: error.message
        })
    }


}