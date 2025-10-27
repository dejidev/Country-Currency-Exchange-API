const express = require('express');
const countryController = require('../controllers/countryController');
const { validateCountryQuery, validateCountryName } = require('../middleware/validation');

const router = express.Router();

// POST /countries/refresh - Refresh all countries
router.post('/refresh', countryController.refreshCountries);

// GET /countries - Get all countries with filters
router.get('/', validateCountryQuery, countryController.getAllCountries);

// GET /countries/image - Get summary image (must come before /:name)
router.get('/image', countryController.getSummaryImage);

// GET /countries/:name - Get single country
router.get('/:name', validateCountryName, countryController.getCountryByName);

// DELETE /countries/:name - Delete country
router.delete('/:name', validateCountryName, countryController.deleteCountry);

module.exports = router;