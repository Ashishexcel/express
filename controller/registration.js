const {UserSignup} = require('../model')
const dotenv = require('dotenv').config();
const bcrypt = require('bcrypt');
const { hash } = require('bcrypt');
const transporter = require('../utils/nodeMailer')
const registerwithpassport = async(req, res,next) =>{       
    
    if(req.body.password ==req.body.confirmpassword){
        const hashedpassword = await bcrypt.hash(req.body.password,10);
        

        const Users=new UserSignup({email: req.body.email, 
        username : req.body.username,
        firstname:req.body.firstname,
        lastname:req.body.lastname,
        password:hashedpassword,
        confirmpassword:hashedpassword
    });
         Users.save((err,user)=>{
            if(err){console.log(err)}
            else{
              var mailOptions = {
                from: process.env.USERAUTHFORSENDINGMAIL,
                to: user.email,
                subject: 'thankyou for registring',
                text: 'you are now registered!'
              };

                transporter.sendMail(mailOptions, function(error, info){
                                            if (error) {
                                              console.log(error);
                                            } else {
                                              console.log('Email sent: ' + info.response);
                                            }   
                                          });
                res.json({success: true, 
                  message: "Your account has been saved",
                mail_message:"please check your email address for verification"
                })
            }
        })
    }
        
        

}

module.exports = registerwithpassport;