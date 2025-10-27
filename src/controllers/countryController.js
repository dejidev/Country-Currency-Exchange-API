const countryService = require('../services/countryService');
const imageService = require('../services/imageService');
const path = require('path');
const fs = require('fs').promises;

// POST /countries/refresh
const refreshCountries = async (req, res) => {
    try {
        const result = await countryService.refreshCountries();

        // Generate summary image
        await imageService.generateSummaryImage(
            result.total_countries,
            result.topCountries,
            result.timestamp
        );

        res.json({
            message: 'Countries refreshed successfully',
            total_countries: result.total_countries,
            last_refreshed_at: result.timestamp.toISOString()
        });
    } catch (error) {
        console.error('Refresh error:', error);

        if (error.message.includes('Could not fetch data')) {
            return res.status(503).json({
                error: 'External data source unavailable',
                details: error.message
            });
        }

        res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
};

// GET /countries
const getAllCountries = async (req, res) => {
    try {
        const { region, currency, sort } = req.query;
        const countries = await countryService.getAllCountries({ region, currency, sort });
        res.json(countries);
    } catch (error) {
        console.error('Get countries error:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
};

// GET /countries/:name
const getCountryByName = async (req, res) => {
    try {
        const country = await countryService.getCountryByName(req.params.name);

        if (!country) {
            return res.status(404).json({
                error: 'Country not found'
            });
        }

        res.json(country);
    } catch (error) {
        console.error('Get country error:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
};

// DELETE /countries/:name
const deleteCountry = async (req, res) => {
    try {
        const deleted = await countryService.deleteCountry(req.params.name);

        if (!deleted) {
            return res.status(404).json({
                error: 'Country not found'
            });
        }

        res.json({
            message: 'Country deleted successfully'
        });
    } catch (error) {
        console.error('Delete country error:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
};

// GET /countries/image
const getSummaryImage = async (req, res) => {
    try {
        const imagePath = path.join(process.cwd(), 'cache', 'summary.png');

        try {
            await fs.access(imagePath);
            res.sendFile(imagePath);
        } catch {
            res.status(404).json({
                error: 'Summary image not found'
            });
        }
    } catch (error) {
        console.error('Image error:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
};

module.exports = {
    refreshCountries,
    getAllCountries,
    getCountryByName,
    deleteCountry,
    getSummaryImage
};