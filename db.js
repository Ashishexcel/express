const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

const connection = mongoose.connect(process.env.MONGODBURL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log("database conneted")
}).catch((error)=>{
    console.log("error during connection");
    console.log(error);
})


module.exports = connection;