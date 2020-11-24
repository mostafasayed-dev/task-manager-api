const express = require('express')
const bcrypt = require('bcrypt')
const multer = require('multer')
const sharp = require('sharp')
const User = require('../models/user')
const auth = require('../middleware/auth')
const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account')//use ES6 destructuring

const router = express.Router()
//file uploading
const upload = multer({
    //dest --> commented to be accessable in routing handler to be saved in database
    //dest: 'avatars',// destination folder
    limits:{
        fileSize: 1000000// max file size (1 MB)
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Invalid image!'))// file rejected with error
        }
        cb(undefined, true)// file accepted
    }
})

router.post('/users', async (req, res)=> {
    const user = new User(req.body)
    try{
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    }catch(e){
        res.status(400).send(e)
    }
})

router.post('/users/login', async (req, res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        // res.send({user, token})
        // res.send({user: user.getPublicProfile(), token}) //hide unneccessary data
        res.send({user, token})
    }catch(e){
        res.status(400).send(e)
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try{
        // remove token used with login to update user tokens
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})

router.post('/users/logoutall', auth, async (req, res) => {
    try{
        // remove token used with login to update user tokens
        req.user.tokens = []
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})

// router.get('/users', auth, async (req, res) => {
//     try{
//         const users = await User.find({})
//         res.status(200).send(users)
//     }
//     catch(e){
//         res.status(500).send(e)
//     }
// })

router.get('/users/me', auth, async (req, res) => {
    //console.log(req.user)
    res.send(req.user)
})

// router.get('/users/:id', async (req, res) => {
//     const _id = req.params.id;
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

// router.patch('/users/:id', async (req, res) => {
//     // prevent user from providing properties for update which doesn't exists in th model
//     const updates = Object.keys(req.body)
//     const allowedUpdates = ['name', 'email', 'password', 'age']
//     const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
//     if(!isValidOperation){
//         return res.status(404).send({error: 'Invalid updates!'})
//     }

//     try{
//         // const user = await User.findByIdAndUpdate(req.params.id, 
//         //                                     req.body,// data to update
//         //                                     { new: true, runValidators: true })// options- new: return update document, runValidators: run model validations while updating
//         // changed to access middleware by using save function instead
//         const user = await User.findById(req.params.id)
//         updates.forEach((update) => user[update] = req.body[update])
//         await user.save()

//         if(!user){
//             return res.status(404).send(user)
//         }
//         res.status(200).send(user)
//     }catch(e){
//         res.status(400).send(e)
//     }
// })

router.patch('/users/me', auth, async (req, res) => {
    // prevent user from providing properties for update which doesn't exists in th model
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if(!isValidOperation){
        return res.status(404).send({error: 'Invalid updates!'})
    }

    try{
        //const user = await User.findById(req.params.id)
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()

        res.status(200).send(req.user)
    }catch(e){
        res.status(400).send(e)
    }
})

// router.delete('/users/:id', async (req, res) => {
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

router.delete('/users/me', auth, async (req, res) => {
    try{
        // const user = await User.findByIdAndDelete(req.user._id)
        // if(!user){
        //     return res.status(404).send()
        // }
        await req.user.remove()
        sendCancelationEmail(req.user.email, req.user.name)
        // res.send(user)
        res.send(req.user)
    }catch(error){
        res.status(500).send()
    }
})

// upload.single('avatar') --> avatar is the key sent from the client which hold the file as a value
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    //resize image and convert it to png before sving it to database
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250}).png().toBuffer()
    // req.user.avatar = req.file.buffer
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {// to handle returned error from HTML to JSON
    res.status(400).send({error: error.message})
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    try{
        req.user.avatar = undefined
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send(e)
    }
})

router.get('/users/:id/avatar', async (req, res) => {
    try{
        const user = await User.findById(req.params.id)

        if(!user || !user.avatar){
            throw new Error()
        }

        res.set('Content-Type', 'image/jpg')
        res.send(user.avatar)
    }catch(e){
        res.status(404).send()
    }
})

module.exports = router