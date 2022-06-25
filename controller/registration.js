const UserSignup = require('../model/signupschema')
const bcrypt = require('bcrypt');
const { hash } = require('bcrypt');
const nodemailer = require('nodemailer')
const transporter = require('../utils/nodeMailer')
const registerwithpassport = async(req, res,next) =>{       
    var mailOptions = {
                from: 'ashishjobworkmail@gmail.com',
                to: 'ashishjobworkmail@gmail.com',
                subject: 'thankyou for registring',
                text: 'you are now registered!'
              };
    if(req.body.password ==req.body.confirmpassword){
        const hashedpassword = await bcrypt.hash(req.body.password,10);

        const Users=new UserSignup({email: req.body.email, 
        username : req.body.username,
        firstname:req.body.firstname,
        lastname:req.body.lastname,
        password:hashedpassword,
        confirmpassword:hashedpassword
    });
        await Users.save((err,user)=>{


            if(err){console.log(err)}
            else{

                transporter.sendMail(mailOptions, function(error, info){
                                            if (error) {
                                              console.log(error);
                                            } else {
                                              console.log('Email sent: ' + info.response);
                                            }   
                                          });
                res.json({success: true, message: "Your account has been saved"})
            }
        })
    }
        
        
        // UserSignup.register(Users, function(err, user) { 

        //     if (err) { 

        //       res.json({success:false, message:"Your account could not be saved. Error: ", err}) 

        //     }else{ 

        //       res.json({success: true, message: "Your account has been saved"}) 

        //     } 

        //   }); 

}

module.exports = registerwithpassport;