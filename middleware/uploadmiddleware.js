const multer = require('multer');
const storage = multer.diskStorage({
    destination:"uploads/",
    filename:(req,file,cb)=>{
        cb(null, new Date().toISOString()+file.originalname)
    }
})

const upload = multer({
    limits:{
        fileSize:4*1024*1024
    },
    storage:storage
});

module.exports = upload;