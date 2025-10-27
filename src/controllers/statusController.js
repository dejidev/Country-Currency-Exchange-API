const statusService = require('../services/statusService');

// GET /status
const getStatus = async (req, res) => {
    try {
        const status = await statusService.getStatus();
        res.json(status);
    } catch (error) {
        console.error('Status error:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
};

module.exports = {
    getStatus
};