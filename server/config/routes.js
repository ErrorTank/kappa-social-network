const express = require('express');
const router = express.Router();

module.exports = (db, namespacesIO) => {
  router.use("/loz", (req, res) => {
     res.send("loz")
  });
  return router;
};