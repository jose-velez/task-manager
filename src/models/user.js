const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(value){
            if(value.length <= 6 || value.includes('password')){
                throw Error('Password Must be longer than 6 characters or not include the world password.')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value){
            if(value < 0){
                throw new Error('Age must a positive number')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
})

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject()
    
    delete userObject.password;
    delete userObject.tokens;
    
    return userObject;
}
// This is accessible on the instances.  Lower Case.  Single one. Specific one
userSchema.methods.generateAuthToken = async function() {
    const user = this;
    const token = await jwt.sign({_id : user._id.toString()}, 'thisismynewcourse');
    user.tokens = user.tokens.concat({token});
    await user.save();
    return token;
}

// Accessible on the model.  Upper Case one.
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email});
    if(!user){
        throw  new Error('Unable to login');
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    
    if(!isMatch){
        throw new Error('Unable to login');
    }
    
    return user;
}

//Hash the plain text password before saving
userSchema.pre('save', async function(next){
    const user = this;
    
    console.log('Just before saving')
    
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
})

// Delete user Tasks when user is removed

userSchema.pre('remove', async function () {
    const user = this
    await Task.deleteMany({owner: user._id});
    next();
})

const User = mongoose.model('User', userSchema)

module.exports = User;