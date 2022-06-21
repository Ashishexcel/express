const mongoose = require('mongoose');
const UserSignup = require('../model/signupschema')


const accesstokenSchema =new  mongoose.Schema({
    userid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'UserSignup',
    },
    accesstoken:{
        type:String,
    },
});

module.exports = mongoose.model("AccessToken",accesstokenSchema);
