const passport = require('passport');
const bcrypt = require('bcrypt');
const UserSignup = require('../model/signupschema');  // this is not used
const LocalStrategy =require('passport-local');

const initializelogin=(passport,getUSerByID)=>{
    const authenticateUser =async(email,password,done)=>{
        
        const user = await UserSignup.findOne({email:email});
        console.log(user)
        if(!user){
            return done(null,false,{message:"incorrect emaill"})
        }
    
        if(user==null){return done(null,false,{message:"USer not found"})}
        try {
            const isMatch = await bcrypt.compare(password,user.password);
            if(isMatch){
                
                return done(null,user)
            }else{
                return done(null,password,{message:"password not matched"})
            }
            
        } catch (error) {
            return done(error)
        }

    }
    passport.use(new LocalStrategy({usernameField:'email',passwordField:'password'},authenticateUser));
    passport.serializeUser((user,done)=>{done(null,user._id)})
    passport.deserializeUser((id,done)=>{return done(null,getUSerByID(id) )})
};

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

module.exports = {initializelogin,initializesignup};