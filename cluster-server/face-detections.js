const path = require("path");
const fs = require("fs");
const fetch = require('node-fetch');


const canvas = require("canvas");

const faceapi = require("face-api.js");

const MODELS_URL = path.join(__dirname, './' + process.env.MODELS_DIR);


const monkeyPatchFaceApiEnv = () => {
    const { Canvas, Image, ImageData } = canvas;
    faceapi.env.monkeyPatch({ Canvas, Image, ImageData });
    faceapi.env.monkeyPatch({ fetch });
}
monkeyPatchFaceApiEnv();
const loadFaceDetecsModels = () => {

    return Promise.all([
        faceapi.nets.faceRecognitionNet.loadFromDisk(MODELS_URL),
        faceapi.nets.faceLandmark68Net.loadFromDisk(MODELS_URL),
        faceapi.nets.ssdMobilenetv1.loadFromDisk(MODELS_URL),
        faceapi.nets.ageGenderNet.loadFromDisk(MODELS_URL),
        faceapi.nets.faceExpressionNet.loadFromDisk(MODELS_URL)
    ])
}


const detectFaces = async (img_url, displaySize) =>  {
    const imgAbsUrl = path.join(__dirname, './' + process.env.TEMP_IMAGES_DIR + `/${img_url}`);
    const image = await canvas.loadImage(imgAbsUrl);

    const detections = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors();
    fs.unlinkSync(imgAbsUrl);
    return faceapi.resizeResults(detections, displaySize);



}



const detectFaces2 = async (img_url, displaySize) =>  {

    const image = await canvas.loadImage(img_url);

    const detections = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors();

    return faceapi.resizeResults(detections, displaySize);



}


module.exports = {loadFaceDetecsModels, detectFaces, detectFaces2}