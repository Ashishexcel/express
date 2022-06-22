const mongoose = require('mongoose');
const UserSignup = require('../model/signupschema')


const useraddressSchema =new  mongoose.Schema({
    userid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'UserSignup',
    },
    
        city:{
            type:String
        },
        state:{
            type:String
        },
        pin:{
            type:Number,
        },
        number:{
            type:Number,
            minlength:[10,"number must be of 10 digits"]
            }
    
})

module.exports = mongoose.model('Address',useraddressSchema);