const mongoose = require('mongoose');
const UserSignup = require('../model/signupschema')


const useraddressSchema =new  mongoose.Schema({
    userid:{
        type:mongoose.Schema.Types.ObjectId,
        refs:'UserSignup',
    },
    address:[{

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
        }]
})

module.exports = mongoose.model('Address',useraddressSchema);