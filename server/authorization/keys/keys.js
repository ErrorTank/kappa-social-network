const fs = require("fs");
const path = require("path");

module.exports = {
  getPrivateKey(){
    return fs.readFileSync(path.resolve(__dirname, './private.key'), 'utf8');
  },
  getPublicKey(){
    return fs.readFileSync(path.resolve(__dirname, './public.key'), 'utf8');
  }
};
