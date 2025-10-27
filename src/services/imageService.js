const fs = require('fs').promises;
const path = require('path');
const { createCanvas } = require('canvas');

// Generate summary image
const generateSummaryImage = async (totalCountries, topCountries, timestamp) => {
    try {
        // Ensure cache directory exists
        const cacheDir = path.join(process.cwd(), 'cache');
        await fs.mkdir(cacheDir, { recursive: true });

        const width = 800;
        const height = 600;
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        // Background
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, width, height);

        // Title
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 32px Arial';
        ctx.fillText('Country Data Summary', 50, 60);

        // Total countries
        ctx.font = '24px Arial';
        ctx.fillStyle = '#16c79a';
        ctx.fillText(`Total Countries: ${totalCountries}`, 50, 120);

        // Timestamp
        ctx.font = '18px Arial';
        ctx.fillStyle = '#a8a8a8';
        ctx.fillText(`Last Updated: ${new Date(timestamp).toLocaleString()}`, 50, 155);

        // Top 5 countries header
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px Arial';
        ctx.fillText('Top 5 Countries by Estimated GDP', 50, 210);

        // Draw top countries
        ctx.font = '18px Arial';
        let yPos = 250;
        topCountries.forEach((country, index) => {
            ctx.fillStyle = '#ffffff';
            ctx.fillText(`${index + 1}. ${country.name}`, 70, yPos);

            ctx.fillStyle = '#16c79a';
            const gdp = country.estimated_gdp
                ? `$${parseFloat(country.estimated_gdp).toLocaleString('en-US', { maximumFractionDigits: 2 })}`
                : 'N/A';
            ctx.fillText(gdp, 70, yPos + 25);

            ctx.fillStyle = '#a8a8a8';
            ctx.font = '14px Arial';
            ctx.fillText(`Currency: ${country.currency_code || 'N/A'}`, 70, yPos + 45);
            ctx.font = '18px Arial';

            yPos += 80;
        });

        // Save image
        const buffer = canvas.toBuffer('image/png');
        const imagePath = path.join(cacheDir, 'summary.png');
        await fs.writeFile(imagePath, buffer);

        console.log('✅ Summary image generated successfully');
    } catch (error) {
        console.error('❌ Error generating image:', error);
        throw error;
    }
};

module.exports = {
    generateSummaryImage
};