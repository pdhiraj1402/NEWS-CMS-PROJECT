const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null, './public/uploads')
    },
    filename:function(req, file, cb){
        cb(null, Date.now() + path.extname(file.originalname))
    }
});

const filefilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true);
    }
    else{
        cb(new Error('Only JPEG and PNG Files are allowed'));
    }
}

const upload = multer({
    storage:storage,
    limitSize:{
        fileSize:1024*1021*5
    },
    fileFilter:filefilter
});

module.exports = upload;