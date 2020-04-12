const fs = require('fs');

const path = require("path");
const source = "../public";
console.log(process.argv[2])

const target = process.argv[2] === 'dev' ? "sw-dev.js" : "sw-prod.js";

const filePath = path.resolve(__dirname, source + "/" + target);

fs.readFile(filePath, 'utf8', function (err,data) {
    if (err) {
        return console.log(err);
    }
    var newVersion = new Date().getTime();
    console.log(newVersion)
    var result = data.replace(/static-v\d+/, 'static-v' + newVersion).replace(/dynamic-v\d+/, 'dynamic-v' + newVersion);


    fs.writeFile(filePath, result, 'utf8', function (err) {
        if (err) return console.log(err);
    });
});