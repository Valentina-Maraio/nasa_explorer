const express = require('express');
const { getNeoFeed, getNeoRange } = require('../controllers/neoController');
const asyncHandler = require('../middleware/asyncHandler');
const { validateDateQuery, validateNeoRangeQuery } = require('../middleware/validateQuery');

const router = express.Router();

router.get('/feed', validateDateQuery, asyncHandler(getNeoFeed));
router.get('/range', validateNeoRangeQuery, asyncHandler(getNeoRange));

module.exports = router;