const express = require('express');
const router = express.Router();
const UserSignup = require('../model/signupschema');
const bcrypt = require('bcrypt');
const verifytoken = require('../middleware/verify');
const verifywithtoken = require('../middleware/verifywithtoken');

//controller
const {register,getuser,deleteuser,pagination,loginandgeneratingnumber,address,userwithaddress}= require('../controller/usercontroller');


router.post('/registration',register);

// router.post('/login',login);

router.post('/login',loginandgeneratingnumber);


router.get('/get',verifytoken,getuser);

router.put('/delete',verifytoken,deleteuser);

router.get('/list/:page',pagination);

router.post('/address',verifywithtoken,address)

router.get('/get/:id',verifywithtoken,userwithaddress)

module.exports = router;