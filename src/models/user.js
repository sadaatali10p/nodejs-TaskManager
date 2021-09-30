const mongoose = require('mongoose')
const validator = require('validator')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true,
    },
    age:{
        type: Number,
        max: [70, 'age should be less than 70'],
        validate(value){
            if (value < 1){
                throw new Error('Age must be a +ve number')
            }
        }
    },
    email:{
        type: String,
        required: true,
        unique: [true, 'email already exist'],
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
              throw new Error('Invalid Email')  
            }
        }
    },
    password:{
        type: String,
        required: true,
        minlength: 6,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Password cannot contain "password"')  
              }
        }
    },
    tokens:[{
        token: {
            type: String,
            required: true
        }
    }],
    photo: {
        type: Buffer
    }
}, {
    timestamps: true
})

userSchema.virtual('tasks',{
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.photo // removing this out while loading the object, since we have a dedicated route t fetch it

    return userObject
}

userSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

userSchema.statics.findByCredentials = async(email, password) => {
    const user = await User.findOne({ email })
    if (!user){
        throw new Error('User not found with email: ' + email)
    }

    const isMatch = await bcryptjs.compare(password, user.password)
    if (!isMatch){
        throw new Error('Password does not match')
    }

    return user
}

// convert the password into hash before save
userSchema.pre('save', async function(next){
    const user = this
    if (user.isModified('password')){
        user.password = await bcryptjs.hash(user.password, 8)
        console.log(user.password)
    }
    next()
})

// Remove associated Tasks before deleteing a user
userSchema.pre('remove', async function(next){
    const user = this
    await Task.deleteMany({ owner: user._id })
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User