const AccessToken = require('../model/accesstokenSchema');


const verifywithtoken = async(req,res,next)=>{
    const token = req.headers.authorization;

    const checktoken = await AccessToken.findOne({accesstoken:token});

    req.userid = checktoken.userid;
    const expiry = checktoken.expiry;
    const currentime = new Date();
    if(currentime.getTime()>!expiry){
        next();
    }else{
        console.log("Your are not authenticated please llogin again")

    }
}

module.exports = verifywithtoken;