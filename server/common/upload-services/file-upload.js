const multer = require("multer");
const path = require("path");
const fs = require('fs');
const {isImage} = require("../../utils/file-utils");

const getFileRelativeStorePath = fileName => {
    return isImage(fileName) ? "/image" : "/file";
};

const fileStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        let p = path.resolve(process.cwd() + "/" + process.env.UPLOAD_DIR + `/${req.user._id}` + getFileRelativeStorePath(file.originalname));
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

const fileUploader = multer({storage: fileStorage, fileFilter});

module.exports = fileUploader;