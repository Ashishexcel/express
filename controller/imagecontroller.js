const image = (req,res)=>{
    try {
        console.log(req.file)
        if(req.file == null){
            res.status(500).json({message:"Image not uploaded"})
        }
        else{
            res.status(201).json({message:"image upload successfully"})
        }
    } catch (error) {
        
    }
}

module.exports = image;