const express = require('express');
const { searchImages, getAsset, getMetadata } = require('../controllers/imageController');
const asyncHandler = require('../middleware/asyncHandler');
const {
  validateImageSearchQuery,
  validateNasaIdQuery,
} = require('../middleware/validateQuery');

const router = express.Router();

router.get('/search', validateImageSearchQuery, asyncHandler(searchImages));
router.get('/asset', validateNasaIdQuery, asyncHandler(getAsset));
router.get('/metadata', validateNasaIdQuery, asyncHandler(getMetadata));

module.exports = router;