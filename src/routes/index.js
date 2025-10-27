const express = require('express');
const countryRoutes = require('./countryRoutes');
const statusRoutes = require('./statusRoutes');

const router = express.Router();

// Root endpoint
router.get('/', (req, res) => {
    res.json({
        message: 'Country Currency & Exchange API',
        version: '1.0.0',
        endpoints: {
            'POST /countries/refresh': 'Fetch and cache all countries',
            'GET /countries': 'Get all countries (supports ?region, ?currency, ?sort)',
            'GET /countries/:name': 'Get specific country',
            'DELETE /countries/:name': 'Delete a country',
            'GET /status': 'Get refresh status',
            'GET /countries/image': 'Get summary image'
        }
    });
});

// Mount routes
router.use('/countries', countryRoutes);
router.use('/status', statusRoutes);

module.exports = router;