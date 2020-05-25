const fs = require('fs');

const path = require("path");
const source = "../public";


const filePath = path.resolve(__dirname, source + "/" + "sw.js");

fs.readFile(filePath, 'utf8', function (err,data) {
    if (err) {
        return console.log(err);
    }
    var newVersion = new Date().getTime();

    var result = data.replace(/static-v\d+/, 'static-v' + newVersion).replace(/dynamic-v\d+/, 'dynamic-v' + newVersion);


    fs.writeFile(filePath, result, 'utf8', function (err) {
        if (err) return console.log(err);
    });
});