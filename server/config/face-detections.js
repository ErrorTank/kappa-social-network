const path = require("path");
const fs = require("fs");
const fetch = require('node-fetch');


const canvas = require("canvas");
const Agenda = require("agenda")
const faceapi = require("face-api.js");
const agenda = new Agenda({db: {address: process.env.DB_HOST}});
const MODELS_URL = path.join(__dirname, '../' + process.env.MODELS_DIR);


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


const detectFaces = (img_url, displaySize) =>  new Promise(async (res, rej) => {

    const imgAbsUrl = path.join(__dirname, '../' + process.env.TEMP_IMAGES_DIR + `/${img_url}`);
    const image = await canvas.loadImage(imgAbsUrl);
    fs.unlinkSync(imgAbsUrl);
    agenda.define("detecface", async job => {
        console.log("Dasdasdasd")
        const detections = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors();
        res(faceapi.resizeResults(detections, displaySize))

    })
    await agenda.start();
    agenda.now("detecface");
    agenda.on('complete', job => {
        console.log(`Job ${job.attrs.name} finished`);
        job.remove();
        // agenda.stop();
    });




})






module.exports = {loadFaceDetecsModels, detectFaces}