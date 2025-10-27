const { validateQueryParams } = require('../utils/helpers');

// Validate query parameters for GET /countries
const validateCountryQuery = (req, res, next) => {
    const validation = validateQueryParams(req.query);

    if (!validation.isValid) {
        return res.status(400).json({
            error: 'Validation failed',
            details: validation.error
        });
    }

    next();
};

// Validate country name parameter
const validateCountryName = (req, res, next) => {
    const { name } = req.params;

    if (!name || name.trim() === '') {
        return res.status(400).json({
            error: 'Validation failed',
            details: 'Country name is required'
        });
    }

    next();
};

module.exports = {
    validateCountryQuery,
    validateCountryName
};