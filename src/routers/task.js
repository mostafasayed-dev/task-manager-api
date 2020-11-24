const express = require('express')
const auth = require('../middleware/auth')
const { update } = require('../models/task')
const Task = require('../models/task')
const User = require('../models/user')

const router = express.Router()

// router.post('/tasks', async (req, res) => {
//     const task = new Task(req.body)
//     try{
//         await task.save()
//         res.status(201).send(task)
//     }
//     catch(e){
//         res.status(400).send(e)
//     }
// })

router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,//ES6 spread operator to copy all of the properties from body over to this object
        owner: req.user._id
    })
    try{
        await task.save()
        res.status(201).send(task)
    }
    catch(e){
        res.status(400).send(e)
    }
})

// router.get('/tasks', async (req, res) => {
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

router.get('/tasks', auth, async (req, res) => {
    try{
        // const tasks = await Task.find({ owner: req.user._id})
        // if(!tasks){
        //     return res.status(404).send()
        // }
        // res.status(200).send(tasks)
        // or
        // await req.user.populate('tasks').execPopulate()
        const match = {}
        const sort = {}

        if(req.query.completed){// set it only if query provided, else this filteration will not be applied
            match.completed = req.query.completed === 'true'
        }
        if(req.query.sortBy){
            const parts = req.query.sortBy.split(':')
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
        }

        await req.user.populate({
            path: 'tasks',
            match,// (filteration)
            options:{
                limit: parseInt(req.query.limit),// max number of rows to be returned from databas (pagination)
                skip: parseInt(req.query.skip),// to define number of rows to skip (pagination)
                sort
                // sort:{
                //     createdAt: -1 // field to sort by : (-1 --> descending & 1 --> ascending)
                // }
            }
            // match: {
            //     completed: false
            // }
        }).execPopulate()
        if(!req.user.tasks){
            return res.status(404).send()
        }
        res.status(200).send(req.user.tasks)
    }catch(e){
        res.status(500).send(e)
    }
})

// router.get('/tasks/:id', async (req, res) => {
//     const _id = req.params.id
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

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    try{
        const task = await Task.findOne({_id, owner: req.user._id})//promis is fullfiled, so you can continue
        
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send(e)
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isAllowed = updates.every((update) => allowedUpdates.includes(update))
    if(!isAllowed){
        return res.status(500).send({'error': 'Invalid body properties!'})
    }

    try {
        // const task = await Task.findByIdAndUpdate(req.params.id,
        //                                           req.body,
        //                                           { new: true, runValidators: true })
        // const task = await Task.findById(req.params.id)
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id})

        if(!task){
            return res.status(404).send()
        }

        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.status(200).send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    try{
        // const task = await Task.findByIdAndDelete(req.params.id)
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})
        if(!task){
            return res.status(404).send('Task with id ' + req.params.id + ' not found!')
        }
        res.send(task)
    }catch(error){
        res.status(500).send(error)
    }
})

module.exports = router