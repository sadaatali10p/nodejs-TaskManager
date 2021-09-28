const express = require('express')
const router = express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')

router.post('/auth/login', async (req,res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)  
        const token = await user.generateAuthToken()  
        res.send({ user, token })
    }
    catch(error){
        console.log(error)
        res.status(400).send()
    }
})

router.post('/auth/logout', auth, async(req, res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token
        })
        await req.user.save()

        res.send()
    }
    catch(error){
        res.statusCode(500).send({error: 'An Error Occured! ' + error})
    }
})

router.post('/auth/logoutall', auth, async(req, res) => {
    try{
        req.user.tokens = []
        await req.user.save()

        res.send()
    }
    catch(error){
        res.statusCode(500).send({error: 'An Error Occured! ' + error})
    }
})

module.exports = router