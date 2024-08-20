const express = require('express');
const router = express.Router();
const controllerFile = require('./controller/fileController');

router.get(
  '/files/data', 
  async (req, res) => {
    await controllerFile.getFiles(req, res);
  }
);

module.exports = router;