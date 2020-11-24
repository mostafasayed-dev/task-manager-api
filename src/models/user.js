const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Task = require('./task')
// const { delete } = require('../routers/user')

//we used schema to take advantages of mongoose middleware
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Invalid email address!')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        trim: true,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Your passwrod must not contains password word!')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value){
            if(value < 0){
                throw new Error('Age must be a positive number')
            }
        }
    },
    tokens: [{
        token:{
            type: String,
            required: true
        }
    }],
    avatar:{
        type: Buffer // to save binary data like images
    }
}, {
    timestamps: true
})

//virtual --> not actual data stored in database but it's a relationship between two entities (User & Task)
// it's a way for mongoose to figure out hwo these two things are related
// it's not stored in the database
// used to get specifc user tasks. it will return array of tasks related to this user
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

//(methods) used to be accessed from from an instance from the model
//called instance methods
userSchema.methods.generateAuthToken = async function(){// we didn't use arrow function to be able to use this key word
    const user = this// to make our function easier to work with
    // const token = jwt.sign({ _id: user._id.toString() }, 'thisismynewcourse')
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

userSchema.methods.getPublicProfile = function(){
    const user = this
    const userObj = user.toObject()

    delete userObj.password
    delete userObj.tokens

    return userObj
}

// will manipulate any user object before returning it
// when returned from JSON.stringify() as JSON.stringify() is 
// called automatically behined the scenes in res.send()
userSchema.methods.toJSON = function(){
    const user = this
    const userObj = user.toObject()

    delete userObj.password
    delete userObj.tokens
    delete userObj.avatar

    return userObj
}

//(statics) used to be accessed directly from the model
userSchema.statics.findByCredentials = async (email, password) => {
    const user =await User.findOne({ email })
    if(!user){
        throw new Error('Unable to login!')
    }

    const isMatched = await bcrypt.compare(password, user.password)
    if(!isMatched){
        throw new Error('Unable to login!')
    }
    return user
}

//this is a middleware to run before saving user for password hashing
userSchema.pre('save', async function(next){// we didn't use arrow function to be able to use this operator
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()// to continue execution to the below
})

// delete user tasks before deleting user itself
userSchema.pre('remove', async function(next){
    const user = this
    await Task.deleteMany({ owner: user._id })
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User