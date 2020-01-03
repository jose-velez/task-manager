const express = require('express');
require('./db/mongoose');
const User = require("./models/user");
const Task = require('./models/task');
const app = express();
const port = process.env.PORT || 3000;
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

/*app.use((req, res, next) => {
    if(req.method == 'GET'){
        return res.send('Get request are disable')
    }else{
        next();
    }
});*/

/*app.use((req, res, next) => {
    res.status(503).send('Site is under maintenance please try again later...')
})*/

app.use(express.json());


app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})


// const main = async () => {
//     // const task = await Task.findById('5e0a38d9ed0ce9164588ee71');
//     // await task.populate('owner').execPopulate();
//     // console.log(task.owner);
//
//     const user = await  User.findById('5e0a33c21acd434504a53cb1');
//     await user.populate('tasks').execPopulate();
//     console.log(user.tasks);
//
//
// }
//
// main();