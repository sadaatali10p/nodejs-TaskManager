const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')

const router = new express.Router()

router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try{
        await user.save()   
        
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

module.exports = router