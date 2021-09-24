const mongoose = require('mongoose')
const validator = require('validator')

const User = mongoose.model('User', {
    name:{
        type: String,
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
    }
})

module.exports = User