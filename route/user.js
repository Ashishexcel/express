const express = require('express');
const router = express.Router();
const UserSignup = require('../model/signupschema');
const bcrypt = require('bcrypt');

const passport = require('passport');




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
const {initializesignup} = require('../passport/passportConfig');
// const initializesignup = require('../passport/passportsignup');
const initializelogin = require('../passport/passportlogin')



//controller
const {getuser,deleteuser,pagination,loginwithpassport,address,userwithaddress,deleteaddress,register}= require('../controller/usercontroller');
const {fgproute,verifypasswordreset} = require('../controller/forgotpassword')




//login reg routes
initializesignup(passport,async(id)=>{
    await UserSignup.find({_id:id})
})
router.post('/registration',register);
// router.post('/registration', passport.authenticate('local'),signupwithpassport)

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
router.put('/verify-reset-password/:passwordreset',verifywithjwt,verifypasswordreset)

module.exports = router;