# Country Currency & Exchange API

A RESTful API that fetches country data from external APIs, stores it in MySQL, and provides comprehensive CRUD operations with currency exchange rates.

## Features

- ✅ Fetch country data from RestCountries API
- ✅ Integrate real-time exchange rates
- ✅ Calculate estimated GDP for each country
- ✅ Generate visual summary images
- ✅ Full CRUD operations
- ✅ Advanced filtering and sorting
- ✅ Comprehensive error handling
- ✅ MySQL database persistence

## Tech Stack

- **Runtime:** Node.js (v16+)
- **Framework:** Express.js
- **Database:** MySQL 8.0+
- **Image Generation:** node-canvas
- **HTTP Client:** Axios

## Prerequisites

Before running this project, ensure you have:

- Node.js v16 or higher installed
- MySQL 8.0+ installed and running
- npm or yarn package manager

## Installation

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd country-currency-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure MySQL Database

Create a MySQL database:

```sql
CREATE DATABASE country_db;
```

### 4. Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=country_db
```

### 5. Run the Application

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:3000`

## Database Schema

The application automatically creates the following tables:

### `countries` table
```sql
- id (INT, AUTO_INCREMENT, PRIMARY KEY)
- name (VARCHAR, UNIQUE, NOT NULL)
- capital (VARCHAR, NULLABLE)
- region (VARCHAR, NULLABLE)
- population (BIGINT, NOT NULL)
- currency_code (VARCHAR, NULLABLE)
- exchange_rate (DECIMAL, NULLABLE)
- estimated_gdp (DECIMAL, NULLABLE)
- flag_url (TEXT, NULLABLE)
- last_refreshed_at (TIMESTAMP)
```

### `refresh_status` table
```sql
- id (INT, PRIMARY KEY, DEFAULT 1)
- total_countries (INT)
- last_refreshed_at (TIMESTAMP)
```

## API Endpoints

### 1. Refresh Countries Data
**Endpoint:** `POST /countries/refresh`

Fetches all countries from external APIs and stores/updates them in the database.

**Response:**
```json
{
  "message": "Countries refreshed successfully",
  "total_countries": 250,
  "last_refreshed_at": "2025-10-27T12:00:00.000Z"
}
```

**Error Responses:**
- `503 Service Unavailable` - External API failure
```json
{
  "error": "External data source unavailable",
  "details": "Could not fetch data from RestCountries API"
}
```

### 2. Get All Countries
**Endpoint:** `GET /countries`

Retrieve all countries with optional filtering and sorting.

**Query Parameters:**
- `region` - Filter by region (e.g., `?region=Africa`)
- `currency` - Filter by currency code (e.g., `?currency=NGN`)
- `sort` - Sort results (e.g., `?sort=gdp_desc`)

**Examples:**
```bash
GET /countries
GET /countries?region=Africa
GET /countries?currency=USD
GET /countries?sort=gdp_desc
GET /countries?region=Europe&sort=gdp_desc
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Nigeria",
    "capital": "Abuja",
    "region": "Africa",
    "population": 206139589,
    "currency_code": "NGN",
    "exchange_rate": 1600.23,
    "estimated_gdp": 25767448125.2,
    "flag_url": "https://flagcdn.com/ng.svg",
    "last_refreshed_at": "2025-10-27T12:00:00.000Z"
  }
]
```

### 3. Get Single Country
**Endpoint:** `GET /countries/:name`

Retrieve a specific country by name (case-insensitive).

**Example:**
```bash
GET /countries/Nigeria
```

**Response:**
```json
{
  "id": 1,
  "name": "Nigeria",
  "capital": "Abuja",
  "region": "Africa",
  "population": 206139589,
  "currency_code": "NGN",
  "exchange_rate": 1600.23,
  "estimated_gdp": 25767448125.2,
  "flag_url": "https://flagcdn.com/ng.svg",
  "last_refreshed_at": "2025-10-27T12:00:00.000Z"
}
```

**Error Response:**
```json
{
  "error": "Country not found"
}
```

### 4. Delete Country
**Endpoint:** `DELETE /countries/:name`

Delete a country record from the database.

**Example:**
```bash
DELETE /countries/Nigeria
```

**Response:**
```json
{
  "message": "Country deleted successfully"
}
```

**Error Response:**
```json
{
  "error": "Country not found"
}
```

### 5. Get Status
**Endpoint:** `GET /status`

Get the total number of countries and last refresh timestamp.

**Response:**
```json
{
  "total_countries": 250,
  "last_refreshed_at": "2025-10-27T12:00:00.000Z"
}
```

### 6. Get Summary Image
**Endpoint:** `GET /countries/image`

Retrieve the generated summary image showing top 5 countries by GDP.

**Response:** PNG image file

**Error Response:**
```json
{
  "error": "Summary image not found"
}
```

## Data Processing Logic

### Currency Handling
- If a country has multiple currencies, only the **first currency code** is stored
- If no currencies exist: `currency_code = null`, `exchange_rate = null`, `estimated_gdp = 0`
- If currency code not found in exchange API: `exchange_rate = null`, `estimated_gdp = null`

### GDP Calculation
```
estimated_gdp = (population × random(1000-2000)) ÷ exchange_rate
```
- Random multiplier regenerates on each refresh
- Set to `null` if exchange rate unavailable
- Set to `0` if no currency exists

### Update Logic
- Countries matched by **case-insensitive name**
- Existing countries: Update all fields with new data
- New countries: Insert as new records
- `last_refreshed_at` updated globally on successful refresh

## Testing the API

### Using cURL

```bash
# Refresh countries
curl -X POST http://localhost:3000/countries/refresh

# Get all countries
curl http://localhost:3000/countries

# Get countries in Africa
curl http://localhost:3000/countries?region=Africa

# Get country by name
curl http://localhost:3000/countries/Nigeria

# Delete country
curl -X DELETE http://localhost:3000/countries/Nigeria

# Get status
curl http://localhost:3000/status

# Download summary image
curl http://localhost:3000/countries/image -o summary.png
```

### Using Postman

1. Import the endpoints into Postman
2. Create a new collection
3. Add requests for each endpoint
4. Test with different query parameters

## Error Handling

The API returns consistent JSON error responses:

| Status Code | Description | Example Response |
|------------|-------------|------------------|
| 400 | Bad Request | `{"error": "Validation failed"}` |
| 404 | Not Found | `{"error": "Country not found"}` |
| 500 | Server Error | `{"error": "Internal server error"}` |
| 503 | Service Unavailable | `{"error": "External data source unavailable"}` |

## Deployment Options

This API can be deployed to:

- **Railway** - `railway up`
- **Heroku** - `git push heroku main`
- **AWS Elastic Beanstalk** - Use EB CLI
- **DigitalOcean App Platform** - Connect GitHub repo
- **Google Cloud Run** - Use Cloud Build

### Environment Variables for Production

Ensure these are set in your hosting platform:
```
PORT=3000
DB_HOST=your-production-db-host
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=country_db
```

## Project Structure

```
country-currency-api/
├── src/
│   ├── config/
│   │   └── database.js          # Database configuration and initialization
│   ├── controllers/
│   │   ├── countryController.js # Country endpoint handlers
│   │   └── statusController.js  # Status endpoint handlers
│   ├── models/
│   │   └── countryModel.js      # Data formatting and validation
│   ├── routes/
│   │   ├── index.js             # Main router
│   │   ├── countryRoutes.js     # Country routes
│   │   └── statusRoutes.js      # Status routes
│   ├── services/
│   │   ├── countryService.js    # Business logic for countries
│   │   ├── statusService.js     # Business logic for status
│   │   ├── externalApiService.js# External API calls
│   │   └── imageService.js      # Image generation logic
│   ├── middleware/
│   │   ├── errorHandler.js      # Error handling middleware
│   │   └── validation.js        # Request validation
│   ├── utils/
│   │   ├── constants.js         # Application constants
│   │   ├── helpers.js           # Helper functions
│   │   └── logger.js            # Logging utility
│   └── server.js                # Application entry point
├── cache/                        # Generated images (auto-created)
│   └── summary.png
├── tests/
│   └── api.test.js              # API tests
├── .env                          # Environment variables
├── .env.example                 # Environment template
├── .gitignore                   # Git ignore rules
├── package.json                 # Dependencies
├── Dockerfile                   # Docker configuration
├── docker-compose.yml           # Docker Compose setup
└── README.md                    # Documentation
```

## Dependencies

### Production
- `express` - Web framework
- `mysql2` - MySQL database driver
- `axios` - HTTP client for external APIs
- `dotenv` - Environment variable management
- `canvas` - Image generation library

### Development
- `nodemon` - Auto-restart on file changes
- `jest` - Testing framework
- `supertest` - HTTP testing

## Troubleshooting

### Database Connection Issues
- Ensure MySQL is running: `mysql.server start` (Mac) or `sudo service mysql start` (Linux)
- Verify credentials in `.env`
- Check if database exists: `SHOW DATABASES;`

### Canvas Installation Issues
On Linux, you may need additional dependencies:
```bash
sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
```

On macOS:
```bash
brew install pkg-config cairo pango libpng jpeg giflib librsvg
```

### Port Already in Use
Change the PORT in `.env` or kill the process:
```bash
lsof -ti:3000 | xargs kill -9
```

## License

MIT

## Support

For issues and questions, please open an issue on the GitHub repository.