const dotenv = require('dotenv').config()
const {UserSignup} = require('../model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const transporter = require('../utils/nodeMailer');

const fgproute = async(req,res,next)=>{

    const userid = req.userid;
    const useremail = req.useremail
    const userdetail = await UserSignup.findOne({_id:userid});
    const hashedpassword = userdetail.password
    if(!userid){
        res.status(500).json({message:"User Not Found please check your email"})
    }else{
        try {
            
            const tokenforreset =  jwt.sign({hashedpassword},process.env.JWT_ACCESS_TOKEN_FOR_PASSWORD,{expiresIn:process.env.PASSWORD_EXPIRY})
            var mailOptions = {
                from: process.env.SENDINGMAIL,
                to: useremail,
                subject: 'reset password link',
                text: `localhost:8000/user/verify-reset-password/${tokenforreset}`
              };
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }   
              });

            res.status(201).json({
                message:"A mail with link sent to your mail Id please check",
                request:{
                    type:'PUT',
                    url:`localhost:8000/user/verify-reset-password/${tokenforreset}`
                }
            })
        } catch (error) {
            console.log(error)
            res.status(500).json({
                message:"something went wrong error while generating jwt token"
                
            })
        }
    }
}

const verifypasswordreset = async(req,res,next)=>{
    const userid = req.userid;
    const useremail = req.useremail
    const tokenfromurl = req.params.passwordreset;
    try {  
        const checktokenwithjwt = jwt.verify(tokenfromurl,process.env.JWT_ACCESS_TOKEN_FOR_PASSWORD)
            const password = req.body.password;
            const confirmpassword = req.body.confirmpassowrd
            console.log(password,confirmpassword)
            if(password ===confirmpassword){
                
                const hashedpassword = await bcrypt.hash(password,10)
                
                const updatedpassword = await UserSignup.findByIdAndUpdate(userid,{
                    $set:{
                        password:hashedpassword,
                        confirmpassowrd:hashedpassword
                    }
                })
                res.status(201).json({
                    "message":"password changed and saved successfully"
                })
                var mailOptions = {
                    from: process.env.SENDINGMAIL,
                    to: useremail,
                    subject: 'your password reset successfull',
                    text: `please login now`
                  };
                  transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                      console.log(error);
                    } else {
                      console.log('Email sent: ' + info.response);
                    }   
                  });
    
            }else{
                res.status(401).json({
                    message:"password does not matched"
                })
            }
    } catch (error) {
        res.status(500).json({error:error})
    }
}   

module.exports = {fgproute,verifypasswordreset};