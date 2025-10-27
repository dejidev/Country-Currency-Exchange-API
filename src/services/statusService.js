const { pool } = require('../config/database');

// Get system status
const getStatus = async () => {
    try {
        const [status] = await pool.query('SELECT * FROM refresh_status WHERE id = 1');

        return {
            total_countries: status[0].total_countries,
            last_refreshed_at: status[0].last_refreshed_at
                ? status[0].last_refreshed_at.toISOString()
                : null
        };
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getStatus
};