const express = require('express');
const router = express.Router();
const UserSignup = require('../model/signupschema');
const bcrypt = require('bcrypt');


const passport = require('passport');


//

//token middleware
const verifytoken = require('../middleware/verify');
const verifywithtoken = require('../middleware/verifywithtoken');
const verifywithjwt = require('../middleware/verifywithjwt')

//image controller
// const {image,onlineimage} = require('../controller/imagecontroller');
const upload = require('../utils/cloudinary');
const {onlineuploader,image} = require('../controller/imagecontroller')
const folderupload = require('../utils/multer')





//passport config
const LocalStrategy = require('passport-local').Strategy; 

passport.serializeUser(UserSignup.serializeUser()); 
passport.deserializeUser(UserSignup.deserializeUser());
const authwithpassportsignup = require('../passport/passportsignup');
passport.use(new LocalStrategy(UserSignup.authenticate()));
const registerwithpassport = require('../controller/registration')
const initializelogin = require('../passport/passportlogin')



//controller
const {getuser,deleteuser,pagination,loginwithpassport,address,userwithaddress,deleteaddress}= require('../controller/usercontroller');
const {fgproute,verifypasswordreset} = require('../controller/forgotpassword')

//scraping controller
const {flipscrap,snapscrap,flipscrapdetail} = require('../controller/scrap')


//login reg routes
authwithpassportsignup(passport,async(id)=>{
    await UserSignup.findById(id)
})
// router.post('/registration',register);
router.post('/registration', registerwithpassport)

// router.post('/login',login);

initializelogin(passport,(id)=>{UserSignup.find({_id:id})})
router.post('/login',passport.authenticate('local'),loginwithpassport); 








//other routes

router.get('/get',verifytoken,getuser);

router.put('/delete',verifytoken,deleteuser);

router.get('/list/:page',pagination);

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