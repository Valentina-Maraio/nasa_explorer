const express = require('express');
const { getApod } = require('../controllers/apodController');
const asyncHandler = require('../middleware/asyncHandler');
const { validateApodQuery } = require('../middleware/validateQuery');

const router = express.Router();

router.get('/', validateApodQuery, asyncHandler(getApod));

module.exports = router;