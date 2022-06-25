const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const passportlocalmongose = require('passport-local-mongoose')

const signupschema = new mongoose.Schema({
    firstname:{
        type:String,
        // required:true
    },
    lastname:{
        type:String,
        // required:true
    },
    username:{
        type:String,
        // required:true,
        // unique:true
    },
    email:{
        type:String,
        // required:true,
        // unique:true,
        // trim:true,
    },
    password:{
        type:String,
        // required:true,
        // minlength:8
    },
    confirmpassword:{
        type:String,
        // required:true,
        // minlength:8
    },
    address:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Address'
    }]
});

// signupschema.methods.matchPassword = async function(password){{
//     try {
//         return await bcrypt.compare(password,this.password)
//     } catch (error) {
//         throw new Error(error)
//     }
// }};
// signupschema.pre('save',async function(next){
//     try {
//         const user = this;
//         const salt = await bcrypt.genSalt(10);
//         const hashedpassword = await bcrypt.hash(this.password,salt);
//         this.password = hashedpassword;
//         next();
//     } catch (error) {
//         return next(error)
//     }
// })
signupschema.plugin(passportlocalmongose)
module.exports = mongoose.model("UserSignup",signupschema);