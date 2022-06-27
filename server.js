const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const connection = require("./db");
const session = require('express-session')
const LocalStrategy = require('passport-local')
const passport = require('passport')
//importing routes
const userroute = require('./route/user')

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false
}))

app.use(passport.initialize());
app.use(passport.session());


//calling routes
app.use('/user',userroute);


app.listen(process.env.PORT,()=>{
    console.log(`server started ${process.env.PORT}`)
    connection;
});