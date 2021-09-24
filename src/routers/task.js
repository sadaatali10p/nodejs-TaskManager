const express = require('express')
const router = express.Router()
const Task = require('../models/task')

router.post('/tasks', async  (req, res) => {
    const task = new Task(req.body)
    try{
        await task.save()    
        res.send(task)
    }
    catch(error){
        res.status(400).send(error)
    }
})

router.get('/tasks', async  (req,res) => {
    try{
        const tasks = await Task.find({})    
        if (!tasks || tasks.length < 1){
            return res.status(404).send()
        }
        res.send(tasks)
    }
    catch(error){
        console.log(error)
        res.status(500).send(error)
    }
})

router.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id    
    try{
        const task = await Task.findById(_id)
        if (!task){
            return res.status(404).send()
        }
        console.log(task)
        res.send(task)
    }
    catch(error){
        console.log(error)
        res.status(500).send(error)
    }
})

router.patch('/tasks/:id', async(req, res) => {
    const updates = Object.keys(req.body)
    const allowedKeys = ['description', 'completed']
    const isValidModel = updates.every((update) => allowedKeys.includes(update))

    if (!isValidModel){
        return res.status(400).send({error: 'Invalid keys found!'})
    }

    const _id = req.params.id
    try{
        const task = await Task.findByIdAndUpdate(_id, req.body, { new: true,  runValidators: true})
        if (!task){
            return res.status(404).send()
        }
        res.send(task)
    }
    catch(error){
        res.status(400).send(error)
    }

})

router.delete('/tasks/:id', async(req, res) => {
    const _id = req.params.id
    try{
        const task = await Task.findByIdAndDelete(_id)
        if (!task){
            return res.status(404).send()
        }
        res.send(task)
    }
    catch(error){
        res.status(400).send(error)
    }
})

module.exports = router