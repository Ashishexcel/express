const passport = require('passport');
const bcrypt = require('bcrypt');
const UserSignup = require('../model/signupschema');
const LocalStrategy =require('passport-local');

const initializesignup = (passport,getUSerByID)=>{
    const registerUser = async(req,username,password,done)=>{
        const user   = await UserSignup.findOne({email:req.body.email})
        
        if(user){
            return done(null,false,{message:"user already exist please login"}) //this is not showing mean this error is not showing only shows authorize
        }
        else{
            if(req.body.password !=req.body.confirmpassword){
                return done(null,false,{message:"Password not matched"})
            }
            var hashedpassword = await bcrypt.hash(req.body.password,10) 
            var newUser = new UserSignup({
                firstname:req.body.firstname,
                lastname:req.body.lastname,
                username:username,
                email:req.body.email,
                password:hashedpassword,
                confirmpassword:hashedpassword
            })
            console.log(newUser)
            newUser.save((err)=>{
                if(err) throw err
                return done(null,newUser)
            })
        }
    }
    passport.use(new LocalStrategy({usernameField:'username',passwordField:'password',passReqToCallback:true},registerUser))
    passport.serializeUser((user,done)=>{done (null,user._id)})
    passport.deserializeUser((id,done)=>{return done(null,getUSerByID(id))})
}

module.exports = initializesignup;