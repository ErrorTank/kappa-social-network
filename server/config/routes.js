const express = require('express');
const router = express.Router();

module.exports = (db, namespacesIO) => {
  router.use("/loz", (req, res) => {
     res.status(200).json({cac: 5});
  });
  return router;
};