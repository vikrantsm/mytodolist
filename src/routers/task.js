const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')

const router = new express.Router()

router.post('/task', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        userId: req.user._id
    })

    try{
        await task.save()
        res.status(201).send(task)
    }catch(error){
        res.status(400).send(error)
    }
})

// router.get('/tasks',auth, async (req, res)=>{
//     try {
//         await req.user.populate('tasks').execPopulate()
//         res.send(req.user.tasks)
//     } catch (error) {
//         res.status(500).send(error)
//     }
// })


router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}
    if(req.query.done){
        match.done = req.query.done === 'true'
    }
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try{
        await req.user.populate({
            path: 'tasks',
            match,
            options:{
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }        
        }).execPopulate()

        res.send(req.user.tasks)
    }catch(error){
        res.status(500).send(error)
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    try{    
        const task = await Task.findOne({ _id, owner: req.user._id})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(error){
        res.status(500).send(error)
    }
})

router.patch('/tasks/:id', auth, async (req, res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description','done']
    const isValideUpdate = updates.every((update) => allowedUpdates.includes(update))

    if(!isValideUpdate){
        return res.status(400).send({error: 'Invalid update.'})
    }

    try {
        const task = await Task.findOne({_id:req.params.id, userId: req.user._id})
        
        if(!task){
            res.status(404).send()
        }

        updates.forEach((update)=> task[update] = req.body[update])
        await task.save()

        res.send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.delete('/tasks/:id', auth, async (req, res)=>{
    try {
        const task = await Task.findOneAndDelete({_id: req.params.id, userId: req.user._id})
        if(!task){
            return res.status(404).send({ error: "No task to delete." })
        }
        res.send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router