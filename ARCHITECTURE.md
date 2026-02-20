# Crypto Price Alert Dashboard Architecture

## Tech Stack

- **Backend**: Python, FastAPI, SQLite
- **Frontend**: React, Tailwind CSS
- **Deployment**: Docker-compose

## Directory Structure

```
/
|-- backend/
|   |-- app/
|   |   |-- __init__.py
|   |   |-- main.py
|   |   |-- models.py
|   |   |-- routers/
|   |   |   |-- __init__.py
|   |   |   |-- price.py
|   |-- tests/
|       |-- test_price.py
|-- frontend/
|   |-- src/
|   |   |-- components/
|   |   |   |-- PriceDisplay.js
|   |   |   |-- PriceChart.js
|   |   |   |-- AlertForm.js
|   |   |-- App.js
|   |   |-- index.js
|   |-- public/
|-- config/
|   |-- docker-compose.yml
|-- docs/
|   |-- openapi.yaml
```

## Database Schema (ERD)

The database will consist of a single table to store Bitcoin prices:

- **prices**
  - id (INTEGER, Primary Key)
  - timestamp (DATETIME)
  - price (REAL)

## API Endpoints

### Get Current Price
- **Endpoint**: `/api/price/current`
- **Method**: GET
- **Response**:
  - 200 OK: `{ "timestamp": "2023-10-01T00:00:00Z", "price": 50000.0 }`

### Get Historical Prices
- **Endpoint**: `/api/price/history`
- **Method**: GET
- **Response**:
  - 200 OK: `[ { "timestamp": "2023-10-01T00:00:00Z", "price": 50000.0 }, ... ]`

### Set Price Alert
- **Endpoint**: `/api/alert`
- **Method**: POST
- **Request Body**:
  - `{ "threshold": 55000.0 }`
- **Response**:
  - 201 Created: `{ "message": "Alert set successfully." }`
