const jwt = require('jsonwebtoken');

const verifywithjwt = (req,res,next)=>{
    const token = req.headers.jwt;
    if(token){
    jwt.verify(token,process.env.JWT_ACCESS_TOKEN,
            (err,decodedToken)=>{
            if(err){
                return err
            }
            else{
                req.userid = decodedToken.userid
                req.useremail = decodedToken.useremail
                console.log("you are authenticated")
                next()
            }
        }
        )
    }else{
        res.status(403).json({
            message:"You are not authenticated"
        })
    }
};

module.exports = verifywithjwt;     