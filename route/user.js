const express = require('express');
const router = express.Router();
const UserSignup = require('../model/signupschema');
const bcrypt = require('bcrypt');
const verifytoken = require('../middleware/verify');
const verifywithtoken = require('../middleware/verifywithtoken');
const image = require('../controller/imagecontroller')

//controller
const {register,getuser,deleteuser,pagination,login,address,userwithaddress}= require('../controller/usercontroller');
const upload = require('../middleware/uploadmiddleware');


router.post('/registration',register);

// router.post('/login',login);

router.post('/login',login);


router.get('/get',verifytoken,getuser);

router.put('/delete',verifytoken,deleteuser);

router.get('/list/:page',pagination);

router.post('/address',verifywithtoken,address)

router.get('/get/:id',verifywithtoken,userwithaddress)

router.post('/profile-image',upload.single('image'),image)

module.exports = router;