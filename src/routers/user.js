const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const upload = require('../middleware/fileupload')
const sharp = require('sharp')
const Email = require('../models/email')
const emailHelper = require('../helpers/Email')

const router = new express.Router()



router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try{
        await user.save()   
        var email = new Email({
            to: user.email,
            from: 'sadaat.ali@10pearls.com',
            subject: 'Hi ' + user.name,
            body: 'Hi ' + user.name,
            html: '<strong>Hi ' + user.name + ', Thanks for creatting account with us!</strong>'
        })
        emailHelper.send(email)

        const token = await user.generateAuthToken()  
        res.send({ user, token })
        
    }
    catch(error){
        res.status(400).send(error)
    }
})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

router.get('/users', auth, async (req,res) => {
    try{
        const users = await User.find({})    
        if (!users || users.length < 1){
            return res.status(404).send()
        }
        res.send(users)
    }
    catch(error){
        console.log(error)
        res.status(500).send(error)
    }
})

router.get('/users/:id', auth, async  (req, res) => {
    const _id = req.params.id    
    try{
        const user = await User.findById(_id)
        if (!user){
            return res.status(404).send()
        }
        res.send(user)
    }
    catch(error){
        console.log(error)
        res.status(500).send(error)
    }

    // User.findById(_id).then((user) => {
    //     if (!user){
    //         return res.status(400).send()
    //     }
    //     res.send(user)
    // }).catch((error) => {
    //     res.status(500).send(error)
    // })
})

router.patch('/users/:id', auth, async(req, res) => {
    const updates = Object.keys(req.body)
    const allowedKeys = ['name', 'age', 'email', 'password']
    const isValidModel = updates.every((update) => allowedKeys.includes(update))

    if (!isValidModel){
        return res.status(400).send({error: 'Invalid keys found!'})
    }

    const _id = req.params.id
    try{
        const user = await User.findById(_id)
        if (!user){
            return res.status(404).send()
        }
        updates.forEach((update) => user[update] = req.body[update])
        await user.save()
        
        res.send(user)
    }
    catch(error){
        res.status(400).send(error)
    }

})

router.patch('/users/me/update', auth, async(req, res) => {
    const updates = Object.keys(req.body)
    const allowedKeys = ['name', 'age', 'email', 'password']
    const isValidModel = updates.every((update) => allowedKeys.includes(update))

    if (!isValidModel){
        return res.status(400).send({error: 'Invalid keys found!'})
    }

    try{
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        
        res.send(req.user)
    }
    catch(error){
        res.status(400).send(error)
    }

})

router.delete('/users/:id', auth, async(req, res) => {
    const _id = req.params.id
    try{
        const user = await User.findByIdAndDelete(_id)
        if (!user){
            return res.status(404).send()
        }
        res.send(user)
    }
    catch(error){
        res.status(400).send(error)
    }
})

router.delete('/users/me/delete', auth, async(req, res) => {
    try{
        await req.user.remove()
        res.send(req.user)
    }
    catch(error){
        res.status(400).send(error)
    }
})

router.post('/users/me/photo', auth, upload.single('photo'), async (req, res) => {
    req.user.photo = await sharp(req.file.buffer).resize({ width: 250, height: 250}).png().toBuffer()
    await req.user.save()
    res.send()
},(error, req,res, next) => {
    res.status(400).send({ error: error.message })
})

router.delete('/users/me/photo', auth, async (req, res) => {
    req.user.photo = undefined
    await req.user.save()
    res.send()
})

router.get('/users/me/photo', auth, async (req, res) => {
    try{
        const user = await User.findById(req.user._id)
        if (!user || !user.photo){
            return res.status(404).send({error: 'image not found'})
        }
        res.set('Content-Type', 'image/jpg')
        res.send(user.photo)
    }
    catch(error){
        res.status(400).send({ error: error.message })
    }
})

module.exports = router