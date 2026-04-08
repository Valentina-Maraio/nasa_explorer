const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const { validateWeatherQuery } = require('../middleware/validateQuery');
const { getMarsWeather, getMoonWeather } = require('../controllers/weatherController');

const router = express.Router();

router.get('/mars', validateWeatherQuery, asyncHandler(getMarsWeather));
router.get('/moon', validateWeatherQuery, asyncHandler(getMoonWeather));

module.exports = router;
