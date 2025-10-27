// API URLs
const API_URLS = {
    COUNTRIES: 'https://restcountries.com/v2/all?fields=name,capital,region,population,flag,currencies',
    EXCHANGE_RATES: 'https://open.er-api.com/v6/latest/USD'
};

// HTTP Status Codes
const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503
};

// Error Messages
const ERROR_MESSAGES = {
    COUNTRY_NOT_FOUND: 'Country not found',
    VALIDATION_FAILED: 'Validation failed',
    INTERNAL_ERROR: 'Internal server error',
    EXTERNAL_API_ERROR: 'External data source unavailable',
    IMAGE_NOT_FOUND: 'Summary image not found'
};

// GDP Calculation Constants
const GDP_CONFIG = {
    MIN_MULTIPLIER: 1000,
    MAX_MULTIPLIER: 2000
};

// Database Config
const DB_CONFIG = {
    CONNECTION_LIMIT: 10,
    QUEUE_LIMIT: 0
};

// API Timeout
const API_TIMEOUT = 30000; // 30 seconds

// Image Config
const IMAGE_CONFIG = {
    WIDTH: 800,
    HEIGHT: 600,
    CACHE_DIR: 'cache',
    FILENAME: 'summary.png'
};

module.exports = {
    API_URLS,
    HTTP_STATUS,
    ERROR_MESSAGES,
    GDP_CONFIG,
    DB_CONFIG,
    API_TIMEOUT,
    IMAGE_CONFIG
};