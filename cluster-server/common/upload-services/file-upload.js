const multer = require("multer");
const path = require("path");
const fs = require('fs');



const tempImageStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        let p = path.resolve(process.cwd() + "/" + process.env.TEMP_IMAGES_DIR);
        fs.mkdirSync(p, { recursive: true })
        cb(null, p);
    },
    filename: function(req, file, cb) {

        cb(null, Date.now() + "-" + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    cb(null, true);
};



const tempImageUploader = multer({storage: tempImageStorage, fileFilter});

module.exports = {tempImageUploader};