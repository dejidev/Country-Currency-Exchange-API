// Format country data for API response
const formatCountry = (country) => {
    return {
        id: country.id,
        name: country.name,
        capital: country.capital,
        region: country.region,
        population: country.population,
        currency_code: country.currency_code,
        exchange_rate: country.exchange_rate ? parseFloat(country.exchange_rate) : null,
        estimated_gdp: country.estimated_gdp ? parseFloat(country.estimated_gdp) : null,
        flag_url: country.flag_url,
        last_refreshed_at: country.last_refreshed_at ? country.last_refreshed_at.toISOString() : null
    };
};

// Validate country data
const validateCountry = (data) => {
    const errors = {};

    if (!data.name || data.name.trim() === '') {
        errors.name = 'is required';
    }

    if (!data.population || data.population < 0) {
        errors.population = 'is required and must be a positive number';
    }

    if (!data.currency_code || data.currency_code.trim() === '') {
        errors.currency_code = 'is required';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

module.exports = {
    formatCountry,
    validateCountry
};