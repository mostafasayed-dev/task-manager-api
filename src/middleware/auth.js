const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
    // console.log('middleware function before running route handler ')
    // next() // to run route handler
    try{
        const token = req.header('Authorization').replace('Bearer ', '')// get token from request header
        // const decode = jwt.verify(token, 'thisismynewcourse')// decode token
        const decode = jwt.verify(token, process.env.JWT_SECRET)// decode token
        const user = await User.findOne({_id: decode._id, 'tokens.token': token})

        if(!user){
            throw new Error()
        }

        req.token = token
        req.user = user
        next()
    }catch(e){
        res.status(401).send({error: 'Authentication failed!'})
    }
}

module.exports = auth