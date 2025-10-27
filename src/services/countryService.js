const { pool } = require('../config/database');
const externalApiService = require('./externalApiService');
const countryModel = require('../models/countryModel');

// Refresh all countries from external APIs
const refreshCountries = async () => {
    let connection;

    try {
        // Fetch data from external APIs
        const countries = await externalApiService.fetchCountries();
        const exchangeRates = await externalApiService.fetchExchangeRates();

        connection = await pool.getConnection();
        await connection.beginTransaction();

        const timestamp = new Date();
        let successCount = 0;

        for (const country of countries) {
            let currencyCode = null;
            let exchangeRate = null;
            let estimatedGdp = null;

            // Handle currency
            if (country.currencies && country.currencies.length > 0) {
                currencyCode = country.currencies[0].code;

                if (currencyCode && exchangeRates[currencyCode]) {
                    exchangeRate = exchangeRates[currencyCode];
                    const randomMultiplier = Math.random() * (2000 - 1000) + 1000;
                    estimatedGdp = (country.population * randomMultiplier) / exchangeRate;
                }
            }

            // If currency not found but has currency code
            if (currencyCode && !exchangeRate) {
                exchangeRate = null;
                estimatedGdp = null;
            }

            // If no currency at all
            if (!currencyCode) {
                currencyCode = null;
                exchangeRate = null;
                estimatedGdp = 0;
            }

            // Insert or update country
            await connection.query(`
        INSERT INTO countries (
          name, capital, region, population, 
          currency_code, exchange_rate, estimated_gdp, 
          flag_url, last_refreshed_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          capital = VALUES(capital),
          region = VALUES(region),
          population = VALUES(population),
          currency_code = VALUES(currency_code),
          exchange_rate = VALUES(exchange_rate),
          estimated_gdp = VALUES(estimated_gdp),
          flag_url = VALUES(flag_url),
          last_refreshed_at = VALUES(last_refreshed_at)
      `, [
                country.name,
                country.capital || null,
                country.region || null,
                country.population,
                currencyCode,
                exchangeRate,
                estimatedGdp,
                country.flag || null,
                timestamp
            ]);

            successCount++;
        }

        // Update refresh status
        await connection.query(`
      UPDATE refresh_status 
      SET total_countries = ?, last_refreshed_at = ?
      WHERE id = 1
    `, [successCount, timestamp]);

        await connection.commit();

        // Get top 5 countries by GDP for image
        const [topCountries] = await connection.query(`
      SELECT name, currency_code, estimated_gdp
      FROM countries
      WHERE estimated_gdp IS NOT NULL
      ORDER BY estimated_gdp DESC
      LIMIT 5
    `);

        connection.release();

        return {
            total_countries: successCount,
            timestamp,
            topCountries
        };

    } catch (error) {
        if (connection) {
            await connection.rollback();
            connection.release();
        }
        throw error;
    }
};

// Get all countries with optional filters
const getAllCountries = async (filters = {}) => {
    try {
        let query = 'SELECT * FROM countries WHERE 1=1';
        const params = [];

        if (filters.region) {
            query += ' AND LOWER(region) = LOWER(?)';
            params.push(filters.region);
        }

        if (filters.currency) {
            query += ' AND LOWER(currency_code) = LOWER(?)';
            params.push(filters.currency);
        }

        if (filters.sort === 'gdp_desc') {
            query += ' ORDER BY estimated_gdp DESC NULLS LAST';
        } else if (filters.sort === 'gdp_asc') {
            query += ' ORDER BY estimated_gdp ASC NULLS LAST';
        } else {
            query += ' ORDER BY name ASC';
        }

        const [countries] = await pool.query(query, params);

        return countries.map(countryModel.formatCountry);
    } catch (error) {
        throw error;
    }
};

// Get single country by name
const getCountryByName = async (name) => {
    try {
        const [countries] = await pool.query(
            'SELECT * FROM countries WHERE LOWER(name) = LOWER(?)',
            [name]
        );

        if (countries.length === 0) {
            return null;
        }

        return countryModel.formatCountry(countries[0]);
    } catch (error) {
        throw error;
    }
};

// Delete country by name
const deleteCountry = async (name) => {
    try {
        const [result] = await pool.query(
            'DELETE FROM countries WHERE LOWER(name) = LOWER(?)',
            [name]
        );

        if (result.affectedRows === 0) {
            return false;
        }

        // Update total count
        const [countries] = await pool.query('SELECT COUNT(*) as count FROM countries');
        await pool.query(
            'UPDATE refresh_status SET total_countries = ? WHERE id = 1',
            [countries[0].count]
        );

        return true;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    refreshCountries,
    getAllCountries,
    getCountryByName,
    deleteCountry
};