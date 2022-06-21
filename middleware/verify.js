const UserSignup = require('../model/signupschema');
const express = require('express')

const verifytoken = async(req,res,next)=>{
    const token = req.headers.authorization;
    
    const userdetail = await UserSignup.find({_id:token})
    req.data = userdetail;
    req.id = token;
    if(userdetail){
        next()
    }
    else{
        res.status(500).send("You are not authenticated")
    }
}

module.exports = verifytoken;