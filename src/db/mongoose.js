const mongoose = require('mongoose')
// const validator = require('validator')

const connectionURL = process.env.MONGODBURL //'mongodb+srv://mostafa:hIeJG6rXzsRoY69h@cluster0.kor3k.mongodb.net/task-manager'
//setup connection to database
mongoose.connect(connectionURL, {
            useNewUrlParser: true, 
            useUnifiedTopology: true, 
            useCreateIndex: true,
            useFindAndModify: false
        }).then((result) => {
            console.log('Connected to database successfully.')
        }).catch((error) => {
            console.log(error)
})
//create model
// const User = mongoose.model('User', {
//     name: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     email: {
//         type: String,
//         required: true,
//         trim: true,
//         lowercase: true,
//         validate(value){
//             if(!validator.isEmail(value)){
//                 throw new Error('Invalid email address!')
//             }
//         }
//     },
//     password: {
//         type: String,
//         required: true,
//         minlength: 6,
//         trim: true,
//         validate(value){
//             if(value.toLowerCase().includes('password')){
//                 throw new Error('Your passwrod must not contains password word!')
//             }
//         }
//     },
//     age: {
//         type: Number,
//         default: 0,
//         validate(value){
//             if(value < 0){
//                 throw new Error('Age must be a positive number')
//             }
//         }
//     }
// })
// //create object from model with document data
// const newUser = new User({
//     name: '   Mostafa  ',
//     email: 'MostafaSayed@gmial.com ',
//     password: '123456'
//     //age: 18
// })
// //saving user
// newUser.save().then((result) => {
//     console.log(result)
// }).catch((error) => {
//     console.log(error)
// })

// const Task = mongoose.model('Task', {
//     description: {
//         type: String,
//         trim: true,
//         required: true
//     },
//     completed: {
//         type: Boolean,
//         default: false
//     }
// })

// const myTask = new Task({
//     description: 'complete my course    ',
//     //completed: false
// })

// myTask.save().then((result) => {
//     console.log(result)
// }).catch((error) => {
//     console.log(error)
// })