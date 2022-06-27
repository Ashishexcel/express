const passport = require('passport');
const bcrypt = require('bcrypt');
const {UserSignup} = require('../model');
const LocalStrategy =require('passport-local');

const initializelogin=(passport,getUSerByID)=>{
    const authenticateUser =async(email,password,done)=>{
        console.log("aksjbcja")
        
        const user = await UserSignup.findOne({email:email});
    
        if(!user){
            return done(null,false,{message:"incorrect emaill"})
        }
        if(user==null){return done(null,false,{message:"USer not found"})}
        try {
            const isMatch = await bcrypt.compare(password,user.password);
            
            if(isMatch){
                console.log("before sending user")
                return done(null,user)
            }else{
                return done(null,false,{message:"password not matched"})
            }
            
        } catch (error) {
            return done(error)
        }

    }
    passport.use(new LocalStrategy({usernameField:'email',passwordField:'password'},authenticateUser));
    passport.serializeUser((user,done)=>{done(null,user._id)})
    passport.deserializeUser((id,done)=>{return done(null,getUSerByID(id) )})
};


module.exports = initializelogin;