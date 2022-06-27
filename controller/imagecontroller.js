const multer = require('multer')
const upload = require('../utils/cloudinary')


const onlineuploader = (req,res)=>{
    try {

        upload.single('image')
        res.status(200).json({message:"image uploaded "}) 
    } catch (error) {
     res.status(500).json({
         message:"internal server error"
     })   
    }

}

const image = (req,res)=>{
    try {
        res.status(201).json({
            message:"Image uploaded to folder"
        })
    } catch (error) {
        res.status(500).json({
            message:"Internal server error"
        })
    }
}
module.exports = {onlineuploader,image};