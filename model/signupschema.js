const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const signupschema = new mongoose.Schema({
    _id:{
        type:mongoose.Schema.Types.ObjectId
    },
    
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
    },
    password:{
        type:String,
        required:true,
        minlength:8
    },
    confirmpassword:{
        type:String,
        required:true,
        minlength:8
    },

});

module.exports = mongoose.model("UserSignup",signupschema);