const express = require('express');
const { getEpicNatural } = require('../controllers/epicController');
const asyncHandler = require('../middleware/asyncHandler');
const { validateDateQuery } = require('../middleware/validateQuery');

const router = express.Router();

router.get('/natural', validateDateQuery, asyncHandler(getEpicNatural));

module.exports = router;