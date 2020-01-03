require('../src/db/mongoose');
const User = require("../src/models/user");

//ObjectId("5dfa90078544034330bbb51d") ObjectId("5dfb80b480701b5b2caad947")


/*User.findByIdAndUpdate('5dfb80b480701b5b2caad947', {age: 1}).then((user) => {
    console.log(user);
    return User.countDocuments({age: 1})
}).then((result) => {
    console.log(result)
}).catch((e) => {
    console.log(e);
})*/


const updateAgeAndCount = async (id, age) => {
    const user = await User.findByIdAndUpdate(id, {age});
    
    const count = await User.countDocuments({age});
    
    return count;
}
//ObjectId("5dfa91e3fa012f9d689a773c")
updateAgeAndCount('5dfa91e3fa012f9d689a773c', 2).then((count) => {
    console.log(count);
}).catch((e) => {
    console.log(e)
})