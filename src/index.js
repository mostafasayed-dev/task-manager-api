const express = require('express')
// const { update } = require('./models/task')
// const Task = require('./models/task')
require('./db/mongoose')//database connection
// const User = require('./models/user')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
// const port = process.env.PORT || 3000
const port = process.env.PORT // because we use dev.env instead

// without middleware:  new request -> run route handler
// with middleware:     new request -> do something -> run route handler 

//middleware function
// app.use - to register a middleware
// app.use((req, res, next) => {
//     res.status(503).send('Service is currently down!')
// })

//const multer = require('multer')
//configure multer
// const upload = multer({
//     dest: 'images',// destination folder
//     limits:{
//         fileSize: 1000000// max size in bytes
//     },
//     fileFilter(req, file, cb){// to filter files by file type
//         // if(!file.originalname.endsWith('.pdf')){
//         //     return cb(new Error('Please upload a PDF file!'))
//         // }
//         //using regular expression
//         if(!file.originalname.match(/\.(doc|docx)$/)){
//             return cb(new Error('Please upload a word document!'))
//         }
//         cb(undefined, true)
//     }
// })
// app.post('/upload', upload.single('upload'), (req, res) => {
//     res.send()
// })

//parse incoming json to an object
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

// const router = new express.Router()
// router.get('/test', (req, res) => {
//     res.send('Hello from express router')
// })
// app.use(router)

// app.post('/users', async (req, res)=> {
//     // console.log(req.body)
//     // res.send('testing api!')
//     const user = new User(req.body)
//     // user.save().then((result) => {
//     //     res.status(201).send(result)
//     // }).catch((error) => {
//     //     res.status(400).send(error)
//     // })
//     try{
//         await user.save()
//         res.status(201).send(user)
//     }catch(e){
//         res.status(400).send(e)
//     }
// })

// app.get('/users', async (req, res) => {
//     // User.find({}).then((users) => {
//     //     res.status(200).send(users)
//     // }).catch((error) => {
//     //     res.status(500).send(error)
//     // })
//     try{
//         const users = await User.find({})
//         res.status(200).send(users)
//     }
//     catch(e){
//         res.status(500).send(e)
//     }
// })

// app.get('/users/:id', async (req, res) => {
//     // User.find({"_id": req.params.id}).then((user) => {
//     //     res.status(200).send(user)
//     // }).catch((error) => {
//     //     res.status(500).send(error)
//     // })
//     const _id = req.params.id;

//     // User.findById(_id).then((user) => {
//     //     if(!user){
//     //         return res.status(404).send()
//     //     }
//     //     res.status(200).send(user)
//     // }).catch((error) => {
//     //     res.status(500).send(error)
//     // })
//     try{
//         const user = await User.findById(_id)
//         if(!user){
//             return res.status(404).send()
//         }
//         res.status(200).send(user)
//     }catch(e){
//         res.status(500).send(e)
//     }
// })

// app.patch('/users/:id', async (req, res) => {
//     // prevent user from providing properties for update which doesn't exists in th model
//     const updates = Object.keys(req.body)
//     const allowedUpdates = ['name', 'email', 'password', 'age']
//     // const isValidOperation = update.every((update) => {
//     //     return allowedUpdates.includes(update)
//     // })
//     const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
//     if(!isValidOperation){
//         return res.status(404).send({error: 'Invalid updates!'})
//     }

//     try{
//         const user = await User.findByIdAndUpdate(req.params.id, 
//                                             req.body,// data to update
//                                             { new: true, runValidators: true })// options- new: return update document, runValidators: run model validations while updating
//         if(!user){
//             return res.status(404).send(user)
//         }
//         res.status(200).send(user)
//     }catch(e){
//         res.status(400).send(e)
//     }
// })

// app.delete('/users/:id', async (req, res) => {
//     try{
//         const user = await User.findByIdAndDelete(req.params.id)
//         if(!user){
//             return res.status(404).send()
//         }
//         res.send(user)
//     }catch(error){
//         res.status(500).send()
//     }
// })

// app.post('/tasks', async (req, res) => {
//     const task = new Task(req.body)
//     // task.save().then((result) => {
//     //     res.status(201).send(result)
//     // }).catch((error) => {
//     //     res.status(400).send(error)
//     // })
//     try{
//         await task.save()
//         res.status(201).send(task)
//     }
//     catch(e){
//         res.status(400).send(e)
//     }
// })

// app.get('/tasks', async (req, res) => {
//     // Task.find({}).then((tasks) => {
//     //     if(!tasks){
//     //         return res.status(404).send()
//     //     }
//     //     res.status(200).send(tasks)
//     // }).catch((error) => {
//     //     res.status(500).send(error)
//     // })

//     try{
//         const tasks = await Task.find({})
//         if(!tasks){
//             return res.status(404).send()
//         }
//         res.status(200).send(tasks)
//     }catch(e){
//         res.status(500).send(e)
//     }
// })

// app.get('/tasks/:id', async (req, res) => {
//     const _id = req.params.id
//     // Task.findById(_id).then((task) => {
//     //     if(!task){
//     //         return res.status(404).send()
//     //     }
//     //     res.status(200).send(task)
//     // }).catch((error) => {
//     //     res.status(500).send(error)
//     // })

//     try{
//         const task = await Task.findById(_id)//promis is fullfiled, so you can continue
//         if(!task){
//             return res.status(404).send()
//         }
//         res.status(200).send(task)
//     }catch(e){
//         res.status(500).send(e)
//     }
// })

// app.patch('/tasks/:id', async (req, res) => {
//     const updates = Object.keys(req.body)
//     const allowedUpdates = ['description', 'completed']
//     const isAllowed = updates.every((update) => allowedUpdates.includes(update))
//     if(!isAllowed){
//         return res.status(500).send({'error': 'Invalid body properties!'})
//     }

//     try {
//         const task = await Task.findByIdAndUpdate(req.params.id,
//                                                   req.body,
//                                                   { new: true, runValidators: true })
//         if(!task){
//             return res.status(404).send()
//         }
//         res.status(200).send(task)
//     } catch (error) {
//         res.status(500).send(error)
//     }
// })

// app.delete('/tasks/:id', async (req, res) => {
//     try{
//         const task = await Task.findByIdAndDelete(req.params.id)
//         if(!task){
//             return res.status(404).send('Task with id ' + req.params.id + ' not found!')
//         }
//         res.send(task)
//     }catch(error){
//         res.status(500).send(error)
//     }
// })

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

// const Task = require('./models/task')
// const User = require('./models/user')

// const populateUser = async () => {
//     const task = await Task.findById('5fb3cc43b3622c3f70bc3e2f')
//     // console.log(task)
//     await task.populate('owner').execPopulate()// to get user itself as we referenced it in Task model
//     console.log(task.owner)
// }

// const populateTasks = async () => {
//     const user = await User.findById('5fb134d762ba391758e583da')
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks)
// }

// populateUser()
// populateTasks()