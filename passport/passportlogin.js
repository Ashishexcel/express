const passport = require('passport');
const bcrypt = require('bcrypt');
const UserSignup = require('../model/signupschema');
const LocalStrategy =require('passport-local');

const initializelogin=(passport,getUSerByID)=>{
    const authenticateUser =async(email,password,done)=>{
        console.log(email)
        
        const user = await UserSignup.findOne({email:email});
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


module.exports = initializelogin;