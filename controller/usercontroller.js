const bcrypt = require("bcrypt");
const {UserSignup,Address,AccessToken} = require('../model');
const { default: mongoose } = require("mongoose");
const jwt = require("jsonwebtoken");
const passport = require('passport')
const nodemailer = require('nodemailer')
const transporter = require('../utils/nodeMailer')


//login with passport and JWT
const loginwithpassport = (req, res, next) => {
    try {
        passport.authenticate('local')
        const user = req.user //geting data of user here //from passport
        const userid = user._id;
        const useremail = user.email
        let token = jwt.sign({ userid, useremail }, process.env.JWT_ACCESS_TOKEN, { expiresIn: process.env.EXPIRY })
        const tokengen = new AccessToken({
            userid: userid,
            accesstoken: token
        });
        tokengen.save();
        res.header('jwt', tokengen.accesstoken)

        res.status(201).json({
            message: "user found and token generated..."
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message
        })
    }
}






//get user
const getuser = async(req, res) => {
    try {
        let userid = req.userid;
        const userdata = await UserSignup.findOne({_id:userid})
        if(!userdata){res.status(404).json({message:"User not found"})}
        else{
            res.status(200).json({
                userdetail:userdata
            });
        }
        
    } catch (error) {
        res.status(500).json({
            message:"internal server error"
        })
    }
};

//delete user

const deleteuser = async (req, res) => {
    let userid = req.userid;
    try {
        const deleted = await UserSignup.findByIdAndDelete({ _id: userid })
        res.status(200).json({ message: "Data deleted" })

    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
        console.log(error)
    }

};

//pagination
const pagination = async (req, res) => {
    try {
        let page = req.params.page;
        let size = req.params.size;
        if (!page) { page = 1 }
        try {
            const user = await UserSignup.find().skip((size * page) - size).limit(size);
            res.status(200).json({
                page: page,
                size: size,
                users: user
            });     

        } catch (error) {   
            console.log(error)
            res.status(500).json({ message: "Something went wrong during searching" })
        }


    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
};

//address
const address = async (req, res) => {
    const userid = req.userid //fetching userid from the verifywithjwt token
    try {
        const address = new Address({
                        userid: userid,
                        city:req.body.city,
                        state:req.body.state,
                        pin:req.body.pin,
                        number:req.body.number
                    });
                    
                    let userdetail = await UserSignup.findById(userid);
                    userdetail.address.push(address._id);
                    await userdetail.save();

                    const address_data = await address.save();
                    UserSignup.findOneAndUpdate({_id:userid})

                    res.status(201).json({
                        message:"address added",
                        addressdetail:address_data
                    })

    } catch (error) {
        
        res.status(500).json({
            error:error
        })
    }

}

const userwithaddress = async (req, res) => {

    try {
        const userdetail = await UserSignup.findById({_id:req.params.id}).select('firstname lastname email username').populate('address')
        if (!userdetail) {
            res.status(403).json({ message: "User not found" });
        }
        res.status(200).json({
            useraddress: userdetail
        })
    } catch (error) {
        res.status(500).json({
            message:"Internal server error"
        })
    }
}

//deleting address
const deleteaddress = async (req, res) => {
    const userid= req.userid;
    try {
        const array = req.body.array;
        Address.deleteMany({"_id" : { $in : array}}, function(err, result){

            if(err){
                console.log(err)
                res.send(err)
            }
            else{
                res.status(200).send("address deleted")
            }
    
        })
    }
     catch (error) {
        res.status(500).json({
            message:"internal server error"
        })
    }
    
}


module.exports = {
   
    loginwithpassport,
    getuser,
    deleteuser,
    pagination,
    address,
    userwithaddress,
    deleteaddress

};