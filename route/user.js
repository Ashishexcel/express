const express = require('express');
const router = express.Router();

//models
const {UserSignup} = require('../model');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy; 
//this is for registration
passport.serializeUser(UserSignup.serializeUser()); 
passport.deserializeUser(UserSignup.deserializeUser());


//token middleware
// const verifytoken = require('../middleware/verify');
const verifywithjwt = require('../middleware/verifywithjwt') //using this one with jwt


//image controller
const upload = require('../utils/cloudinary');
const {onlineuploader,image} = require('../controller/imagecontroller')
const folderupload = require('../utils/multer')

//passport config
// const authwithpassportsignup = require('../passport/passportsignup');
passport.use(new LocalStrategy(UserSignup.authenticate()));
const registerwithpassport = require('../controller/registration')
const initializelogin = require('../passport/passportlogin')



//controller
const {getuser,deleteuser,pagination,loginwithpassport,address,userwithaddress,deleteaddress}= require('../controller/usercontroller');

//controller for password forgot
const {fgproute,verifypasswordreset} = require('../controller/forgotpassword')

//scraping controller
const {flipscrap,snapscrap,flipscrapdetail} = require('../controller/scrap')


//login reg routes
// authwithpassportsignup(passport,async(id)=>{
//     await UserSignup.findById(id)
// })


//routes for reg and login
router.post('/registration', registerwithpassport)

initializelogin(passport,(id)=>{UserSignup.find({_id:id})})
router.post('/login',passport.authenticate('local'),loginwithpassport); 



//other routes

router.get('/get',verifywithjwt,getuser);

router.put('/delete',verifywithjwt ,deleteuser);

router.get('/list/:page/:size',pagination);

router.post('/address',verifywithjwt,address)

router.get('/get/:id',verifywithjwt,userwithaddress)

router.delete('/address',verifywithjwt,deleteaddress)

router.post('/profile-image',folderupload.single('productImage'),image); 

router.post('/online-storage',onlineuploader);

router.get('/forgot-password',verifywithjwt,fgproute);

router.put('/verify-reset-password/:passwordreset',verifywithjwt,verifypasswordreset);


router.get('/fetch/flipkart/mobile',flipscrap);

router.get('/fetch/snapdeal/t-shirt',snapscrap);    
router.get('/fetch/flipkart/mobile/full',flipscrapdetail);


module.exports = router;