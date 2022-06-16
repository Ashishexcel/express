const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const connection = require("./db");

//routes
const userroute = require('./route/user')


app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use('/user',userroute);

app.listen(process.env.PORT,()=>{
    console.log(`server started ${process.env.PORT}`)
    connection;
});