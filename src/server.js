const express = require('express');
const routes = require('./routes');
const { initDatabase } = require('./config/database');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', routes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Endpoint not found'
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Global error:', err);
    res.status(500).json({
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server
const PORT = process.env.PORT || 3000;

initDatabase()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
        });
    })
    .catch(error => {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    });

module.exports = app;