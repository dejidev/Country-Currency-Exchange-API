const axios = require('axios');

const COUNTRIES_API_URL = 'https://restcountries.com/v2/all?fields=name,capital,region,population,flag,currencies';
const EXCHANGE_API_URL = 'https://open.er-api.com/v6/latest/USD';
const API_TIMEOUT = 30000;

// Fetch countries from RestCountries API
const fetchCountries = async () => {
    try {
        const response = await axios.get(COUNTRIES_API_URL, {
            timeout: API_TIMEOUT
        });
        return response.data;
    } catch (error) {
        console.error('RestCountries API error:', error.message);
        throw new Error('Could not fetch data from RestCountries API');
    }
};

// Fetch exchange rates from ER-API
const fetchExchangeRates = async () => {
    try {
        const response = await axios.get(EXCHANGE_API_URL, {
            timeout: API_TIMEOUT
        });
        return response.data.rates;
    } catch (error) {
        console.error('Exchange Rate API error:', error.message);
        throw new Error('Could not fetch data from Exchange Rate API');
    }
};

module.exports = {
    fetchCountries,
    fetchExchangeRates
};