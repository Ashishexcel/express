const bcrypt = require("bcrypt");
const UserSignup = require('../model/signupschema')
const AccessToken = require('../model/accesstokenSchema'); 
const md5 = require("md5");
const Address = require('../model/addressSchema');
const { default: mongoose } = require("mongoose");


// for registration
const register = async (req,res)=>{
    try {
        const salt = await bcrypt.genSalt();
        const hashedpassword = await bcrypt.hash(req.body.password,salt)
        const newuser = new UserSignup({
            _id:new mongoose.Types.ObjectId(),
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

    } catch (error) {
        console.log(error);
        res.status(500).send("internal server error")
    }
};

//for login
// const login =async(req,res)=>{
//     try {
//         const {email, password} = req.body;
//         const finduser = await UserSignup.findOne({email:email}).lean()
//         if(!finduser) return res.status(500).json({message:"USer not found please login"});
//         const isMatch = await bcrypt.compare(password,finduser.password);
//         if(isMatch){
//             let token = finduser._id
//             res.header('authorization',token);
//             res.status(200).json({
//                 message:"User found",
//                 data:token
//             })
//         }
//         else{
//             res.status(500).json({message:"something went wrong"})
//         }
//     } catch (error) {
//         res.status.json({message:"something went wronng"})
//     }
// }
//login and generaating random number;
const loginandgeneratingnumber =async(req,res)=>{
    try {
                const {email, password} = req.body;
                const finduser = await UserSignup.findOne({email:email}).lean()
                if(!finduser) return res.status(500).json({message:"USer not found please login"});
                const isMatch = await bcrypt.compare(password,finduser.password);
                if(isMatch){
                    const userid = finduser._id
                    var today = new Date();
                    today = (today.getTime()+3600);
                    const tokendetail= new AccessToken({
                        userid:userid,
                        accesstoken:md5(userid),
                        expiry:today
                    })
                    tokendetail.save();
                    let token = finduser._id
                    res.header('authorization',tokendetail.accesstoken);
                    res.status(200).json({
                        message:"User found",
                        data:token
                    })
                }
                else{
                    res.status(500).json({message:"something went wrong"})
                }
            } catch (error) {
                res.status.json({message:"something went wronng"})
            }
        }


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
const address = (req,res)=>{
    const userid = req.userid
    try {
        const useraddress = new Address({
            userid:userid,
            address:req.body.address
        });
        useraddress.save();
        try {
            res.status(200).json({
                message:"address saved",
                address:useraddress
            })
        } catch (error) {
            console.log(error);
            console.log("error aftersaving")
        }
    } catch (error) {
        console.log("error in before doing anything")
    }
}

const userwithaddress = async(req,res)=>{
    const userdetail = await UserSignup.findOne({_id:req.params.id}).select('firstname lastname email username')
    const useraddress = await Address.findOne({userid:req.params.id});

    

    if(!useraddress){
        res.status(500).json({message:"User not found"});
    }
    res.status(200).json({
        userdetail:userdetail,
        useraddress:useraddress
    })
}


module.exports = {
    register,
    // login,
    getuser,
    deleteuser,
    pagination,
    loginandgeneratingnumber,
    address,
    userwithaddress
};