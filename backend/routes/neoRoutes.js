const express = require('express');
const { getNeoFeed } = require('../controllers/neoController');
const asyncHandler = require('../middleware/asyncHandler');
const { validateDateQuery } = require('../middleware/validateQuery');

const router = express.Router();

router.get('/feed', validateDateQuery, asyncHandler(getNeoFeed));

module.exports = router;