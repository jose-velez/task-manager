const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const auth = require('../middleware/auth');

router.post('/tasks',auth, async (req, res) => {
    const task  = new Task({
        ...req.body,
        owner: req.user._id
    })
    try{
        await task.save();
        res.status(201).send(task);
    }catch (e) {
        res.status(400).send('Woops! Check your details: ' + e);
    }
})

// GET /tasks?completed=true
router.get('/tasks', auth, async (req, res) => {
    const match = {}
    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }
    try {
        await req.user.populate({
            path: 'tasks',
            match
        }).execPopulate();
        res.send(req.user.tasks);
    }catch (e) {
        res.status(500).send();
    }
})

router.get('/tasks/:id', auth, async (req,res) => {
    const _id = req.params.id;
    try{
        const task = await  Task.findOne({_id, owner: req.user._id})
        if(!task){
            res.status(404).send();
        }
        
        res.send(task);
        
    }catch(e){
        res.status(500).send();
    }
    
    
    
})

router.patch('/tasks/:id', auth, async (req,res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ["description", "completed"];
    const isValidUpdate = updates.every((update) => {
        return allowedUpdates.includes(update);
    })
    if(!isValidUpdate){return res.status(400).send({error: "Invalid Updates"})}
    try{
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id});
        if(!task){
            return res.status(404).send('Woops!! Task not found')
        }
        
        updates.forEach((update) => task[update] = req.body[update])
        
        await task.save();
        
        res.send(task);
    }catch (e) {
        res.status(400).send(e);
    }
} )

router.delete('/tasks/:id', auth, async (req, res) =>{
    try{
        //const  task = await Task.findByIdAndDelete(req.params.id);
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id});
        
        if(!task) return res.status(404).send();
        
        res.send(task)
    }  catch (e) {
        console.log(e);
        res.status(500).send();
    }
})




module.exports = router;