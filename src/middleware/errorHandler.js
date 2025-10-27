// Centralized error handling middleware
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // Default error
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal server error';

    // Handle specific error types
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = 'Validation failed';
    }

    if (err.code === 'ER_DUP_ENTRY') {
        statusCode = 409;
        message = 'Resource already exists';
    }

    res.status(statusCode).json({
        error: message,
        details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};

// Not found handler
const notFoundHandler = (req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        path: req.originalUrl
    });
};

module.exports = {
    errorHandler,
    notFoundHandler
};