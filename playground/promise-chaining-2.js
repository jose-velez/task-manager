require ('../src/db/mongoose');
const Task = require('../src/models/task');

// ObjectId("5dfa7f01020ee58b84aa2f41")


/*Task.findByIdAndDelete("5dfa7f01020ee58b84aa2f41").then((task) => {
    console.log(task);
    return Task.countDocuments({completed: false})
}).then((result) => {
    console.log(result);
}).catch((e) => {
    console.log(e);
})*/

const deleteTaskAndCount = async (id) => {
    await Task.findByIdAndDelete(id);
    
    const count = await Task.countDocuments({completed: false})
    
    
    return count;
}
//ObjectId("5dfa93591f08d3554c6d940e")
deleteTaskAndCount("5dfa93591f08d3554c6d940e").then(result => {
    console.log(result);
}).catch(e => {
    console.log(e);
})