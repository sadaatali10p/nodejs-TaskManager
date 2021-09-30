const multer = require('multer')

const upload = multer({
    //dest: 'images', commenting t out since we are saving files in db instead of file system
    limits:{
        fileSize: 1000000
    },
    fileFilter(req, file, callback){
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return callback(new Error('Invalid file format'))
        }
        callback(undefined, true)
    } 
})

module.exports = upload