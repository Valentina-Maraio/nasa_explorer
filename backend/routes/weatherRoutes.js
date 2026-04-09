const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const { validateWeatherQuery, validateSolarQuery } = require('../middleware/validateQuery');
const { getMarsWeather, getMoonWeather, getSolarFlares } = require('../controllers/weatherController');

const router = express.Router();

router.get('/mars', validateWeatherQuery, asyncHandler(getMarsWeather));
router.get('/moon', validateWeatherQuery, asyncHandler(getMoonWeather));
router.get('/solar', validateSolarQuery, asyncHandler(getSolarFlares));

module.exports = router;
