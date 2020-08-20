const express = require('express');
const router = express.Router();
const {authorizationUserMiddleware, authorizationDownloadMiddleware} = require("./common/middlewares/common");
const {tempImageUploader} = require('./common/upload-services/file-upload');
const {detectFaces} = require("../cluster-server/face-detections")

module.exports = () => {
    router.post(
        '/detect-faces',
        authorizationUserMiddleware,
        tempImageUploader.single('file'),
        (req, res, next) => {
            let file = req.file;
            let origin_path =
                `${file.filename}`;
            let {width, height} = req.body;

            return detectFaces(origin_path, {width, height})
                .then((data) => {
                    return res.status(200).json(data);
                }).catch(err => next(err));


        }
    );

    return router;
};