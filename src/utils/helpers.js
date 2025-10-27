const { GDP_CONFIG } = require('./constants');

// Generate random multiplier for GDP calculation
const generateRandomMultiplier = () => {
    return Math.random() * (GDP_CONFIG.MAX_MULTIPLIER - GDP_CONFIG.MIN_MULTIPLIER) + GDP_CONFIG.MIN_MULTIPLIER;
};

// Calculate estimated GDP
const calculateEstimatedGDP = (population, exchangeRate) => {
    if (!exchangeRate || exchangeRate === 0) return null;
    const multiplier = generateRandomMultiplier();
    return (population * multiplier) / exchangeRate;
};

// Format number with commas
const formatNumber = (num) => {
    if (num === null || num === undefined) return 'N/A';
    return parseFloat(num).toLocaleString('en-US', { maximumFractionDigits: 2 });
};

// Validate query parameters
const validateQueryParams = (query) => {
    const validSortOptions = ['gdp_desc', 'gdp_asc'];

    if (query.sort && !validSortOptions.includes(query.sort)) {
        return {
            isValid: false,
            error: `Invalid sort parameter. Valid options: ${validSortOptions.join(', ')}`
        };
    }

    return { isValid: true };
};

module.exports = {
    generateRandomMultiplier,
    calculateEstimatedGDP,
    formatNumber,
    validateQueryParams
};