const bcrypt = require("bcrypt");
const UserSignup = require('../model/signupschema')
const AccessToken = require('../model/accesstokenSchema'); 

const Address = require('../model/addressSchema');
const { default: mongoose } = require("mongoose");
const jwt = require("jsonwebtoken");
const passport = require('passport')
const TokenExpiredError = require("jsonwebtoken/lib/TokenExpiredError");
const nodemailer = require('nodemailer')
const transporter = require('../utils/nodeMailer')

// for registration simple method

const register = async (req,res)=>{
    var mailOptions = {
        from: 'ashishjobworkmail@gmail.com',
        to: 'ashishjobworkmail@gmail.com',
        subject: 'thankyou for registring',
        text: 'you are now registered!'
      };
    try {
        const salt = await bcrypt.genSalt();
        const hashedpassword = await bcrypt.hash(req.body.password,salt)
        const newuser = new UserSignup({
          
            firstname:req.body.firstname,
            lastname:req.body.lastname,
            username:req.body.username,
            email:req.body.email,
            password:req.body.password,
            confirmpassword:req.body.confirmpassword
        });

        if(newuser.password!=newuser.confirmpassword)return res.status(500).json({message:"password does not matched"})

        newuser.password = hashedpassword;
        newuser.confirmpassword = hashedpassword;
    
        newuser.save((err,doc)=>{
            if(err) res.status(500).json({message:"Not saved"})
            res.status(200).json({
                message:"Data saved",
                userdetail:doc
            })
        })
        transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                          console.log(error);
                        } else {
                          console.log('Email sent: ' + info.response);
                        }   
                      });

    } catch (error) {
        console.log(error);
        res.status(500).send("internal server error")
    }
};
//registration with passport

//node mailer
  
  
  

// //
// const signupwithpassport = (req,res,next)=>{
//     try {
//         console.log("am in signup")
//         const newUser = req.newUser
//         transporter.sendMail(mailOptions, function(error, info){
//             if (error) {
//               console.log(error);
//             } else {
//               console.log('Email sent: ' + info.response);
//             }
//           });
//         res.status(201).json({
//             message:"New user added",
//             userdetail:newUser
//         })

//     } catch (error) {
//         res.status(500).json({
//             message:"something went wrong",
//             error:error,
//             errormessage:error.message
//         })
//     }
// }

//login with passport and JWT
const loginwithpassport = (req,res,next)=>{
    try {
        passport.authenticate('local')
        const user = req.user //geting data of user here //from passport
        const userid = user._id;
        const useremail = user.email
        let token = jwt.sign({userid,useremail},process.env.JWT_ACCESS_TOKEN,{expiresIn:process.env.EXPIRY})
            const tokengen = new AccessToken({
                userid:userid,
                accesstoken:token
            });
            tokengen.save();
            res.header('jwt',tokengen.accesstoken)

            res.status(201).json({
                message:"user found and token generated..."
            })
    } catch (error) {
        console.log(error);
        res.status(403).json({
            message:error.message
        })
    }
}





//for login  implement JWT

// const login =async(req,res,next)=>{
//     console.log("enterig here")
//     try {
//         const {email, password} = req.body;
//         const finduser = await UserSignup.findOne({email:email}).lean()
//         if(!finduser) return res.status(500).json({message:"USer not found please login"});
//         const isMatch = await bcrypt.compare(password,finduser.password);
//         if(isMatch){
//             const userid = finduser._id;
//             let token = jwt.sign({userid,email},process.env.JWT_ACCESS_TOKEN,{expiresIn:process.env.EXPIRY})
//             const tokengen = new AccessToken({
//                 userid:userid,
//                 accesstoken:token
//             });
//             tokengen.save();
//             res.header('jwt',tokengen.accesstoken)
//             res.status(201).json({
//                 message:"USer found"
//             })
//         }
//         else{
//             res.status(500).json({message:"password does not matched please try again"})
//         }
//     } catch (error) {
//         res.status(500).json({message:"something went wronng"})
//     }
// }
// login and generaating random number;
// const loginandgeneratingnumber =async(req,res)=>{
//     try {
//                 const {email, password} = req.body;
//                 const finduser = await UserSignup.findOne({email:email}).lean()
//                 if(!finduser) return res.status(500).json({message:"USer not found please login"});
//                 const isMatch = await bcrypt.compare(password,finduser.password);
//                 if(isMatch){
//                     const userid = finduser._id
//                     var today = new Date();
//                     today = (today.getTime()+3600);
//                     const tokendetail= new AccessToken({
//                         userid:userid,
//                         accesstoken:md5(userid),
//                         expiry:today
//                     })
//                     tokendetail.save();
//                     let token = finduser._id
//                     res.header('authorization',tokendetail.accesstoken);
//                     res.status(200).json({
//                         message:"User found",
//                         data:token
//                     })
//                 }
//                 else{
//                     res.status(500).json({message:"something went wrong"})
//                 }
//             } catch (error) {
//                 res.status.json({message:"something went wronng"})
//             }
//         }


//get user
const getuser = (req,res)=>{
    let token = req.data;

    res.status(200).json({
        message:"you are authenticated",
        "userdetail":token
    }); 
};

//delete user

const deleteuser = async(req,res)=>{
    let token = req.id;
    try {
        const deleted = await UserSignup.findByIdAndDelete({_id:token})
        res.status(200).json({message:"Data deleted"})

          

    } catch (error) {
        res.status(500).json({message:"Internal server error"})
        console.log(error)
    }
    
};

//pagination
const pagination = async(req,res)=>{
    try {
        let page = req.params.page;
        let size = 10;
        if(!page){page=1}
        try {
            const user = await UserSignup.find().skip((size*page)-size).limit(size);
            res.status(200).json({
                page:page,
                size:size,
                users:user
            });
            
        } catch (error) {
            console.log(error)
            res.status(500).json({message:"Something went wrong during searching"})
        }


    } catch (error) {
        res.status(500).json({message:"Internal server error"})
    }
};

//address
const address = async(req,res)=>{
    const userid = req.userid //fetching userid from the verifywithjwt token
    try {
        const data = await Address.findOne({userid:userid});
        if(data){
            var addaddress = [];
            for(let i=0;i<data.address.length;i++){
                addaddress.push(data.address[i]);
            }
             addaddress.push(req.body.address);
            const updated_data = await Address.findOneAndUpdate(
            
                {userid:userid},
                {$set:{address:addaddress}}
            )
            console.log(updated_data)
            res.status(200).json({
                message:"address added",
                address:updated_data

            })

        }else{
            const address = new Address({
                _id:mongoose.Types.ObjectId(),
                userid:userid,
                address:req.body.address
            });

            const address_data = await address.save();

            res.status(200).json({
                message:"address saved",
                address:"first time adddress saveed",
                addressdetail:address_data

            })
        }

        
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message})
    }
    
}

const userwithaddress = async(req,res)=>{
    console.log("in userwith address")
    // const userdetail = await UserSignup.findOne({_id:req.params.id}).select('firstname lastname email username').populate('Address')
    // const useraddress = await Address.findOne({userid:req.params.id}).populate({populate:'UserSignup'})

    if(!useraddress){
        res.status(500).json({message:"User not found"});
    }
    res.status(200).json({
        // userdetail:userdetail,
        useraddress:userdetail
    })
}   

//deleting address
const deleteaddress = async(req,res)=>{
    const userid = req.userid
    const useraddressdetail  =await Address.findOne({userid:userid})
    console.log(useraddressdetail.address)
}


module.exports = {
    register,
    // signupwithpassport,
    // login,,
    loginwithpassport,
    getuser,
    deleteuser,
    pagination,
    // loginandgeneratingnumber,
    address,
    userwithaddress,
    deleteaddress
    
};