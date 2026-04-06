const express = require('express');
const { getMarsManifest } = require('../controllers/marsController');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

router.get('/manifest', asyncHandler(getMarsManifest));

module.exports = router;