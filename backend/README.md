# SchoolMap — School Management System

> Proximity-based school discovery powered by Node.js, Express, and MySQL

## Features

- **Full-stack**: Beautiful dark-themed frontend + robust REST API backend
- **Add schools** with full input validation (client-side + server-side)
- **List schools sorted** by real Haversine geographic distance
- **Live dashboard** with school count and API status
- **Toast notifications** for all actions
- **Responsive design**: mobile, tablet, desktop
- **Parameterized SQL queries** (SQL injection protection)
- **Centralized error handling**
- **Postman collection** with documented examples

## Tech Stack

| Layer       | Technology          | Purpose                             |
|-------------|---------------------|-------------------------------------|
| Frontend    | HTML5 + CSS3 + JS   | User interface & interactions       |
| Backend     | Node.js + Express   | REST API server                     |
| Database    | MySQL               | School data persistence             |
| Validation  | express-validator   | Server-side input validation        |
| Dev         | nodemon             | Auto-restart during development     |

## Project Structure

```
school-management-system/
├── public/
│   ├── index.html          # Single-page application
│   ├── css/style.css       # Full design system & components
│   └── js/main.js          # Frontend logic & API calls
├── src/
│   ├── config/db.js        # MySQL connection pool
│   ├── controllers/        # Business logic
│   ├── routes/             # Express route definitions
│   ├── middleware/         # Global error handler
│   ├── utils/              # Haversine distance calculator
│   └── validators/         # express-validator rules
├── database/schema.sql     # DDL + 10 seed schools
├── postman/                # Postman collection
├── app.js                  # Express setup
├── server.js               # Entry point
├── package.json
└── README.md
```

## Quick Start

### Prerequisites

- Node.js v18+
- MySQL 8+
- npm v9+

### 1. Clone

```bash
git clone <repo-url>
cd school-management-system
```

### 2. Install

```bash
npm install
```

### 3. Environment

```bash
cp .env.example .env
```

Edit `.env` with your MySQL credentials.

### 4. Database Setup

```bash
mysql -u root -p < database/schema.sql
```

Or:

```bash
npm run db:setup
```

### 5. Start Dev Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

### 6. Production Start

```bash
npm start
```

## API Reference

### POST /addSchool

Add a new school to the directory.

| Field     | Type   | Required | Constraints        | Example                  |
|-----------|--------|----------|--------------------|--------------------------|
| name      | string | Yes      | 2–255 characters   | Delhi Public School      |
| address   | string | Yes      | 5–500 characters   | Mathura Road, New Delhi  |
| latitude  | number | Yes      | -90 to 90          | 28.5562                  |
| longitude | number | Yes      | -180 to 180        | 77.2722                  |

**Success 201:**

```json
{
  "success": true,
  "message": "School added successfully",
  "data": {
    "id": 11,
    "name": "Delhi Public School",
    "address": "Mathura Road, New Delhi",
    "latitude": 28.5562,
    "longitude": 77.2722,
    "created_at": "2026-05-10T12:00:00.000Z"
  }
}
```

**Validation Error 422:**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "name", "message": "School name is required" }
  ]
}
```

### GET /listSchools

List all schools sorted by proximity to a given location.

| Parameter | Type   | Required | Constraints | Example  |
|-----------|--------|----------|-------------|----------|
| latitude  | number | Yes      | -90 to 90   | 28.6139  |
| longitude | number | Yes      | -180 to 180 | 77.2090  |

**Success 200:**

```json
{
  "success": true,
  "message": "Schools retrieved and sorted by proximity",
  "total": 10,
  "user_location": { "latitude": 28.6139, "longitude": 77.209 },
  "data": [
    {
      "id": 4,
      "name": "St. Columba's School",
      "address": "Ashok Place, New Delhi, Delhi 110001",
      "latitude": 28.6378,
      "longitude": 77.2075,
      "distance_km": 2.73
    }
  ]
}
```

### GET / (Health Check)

```json
{
  "success": true,
  "message": "School Management API",
  "version": "1.0.0",
  "timestamp": "2026-05-10T12:00:00.000Z",
  "endpoints": {
    "addSchool": "POST /addSchool",
    "listSchools": "GET /listSchools?latitude=&longitude="
  }
}
```

## Postman Collection

Import `postman/SchoolManagement.postman_collection.json` into Postman.

Set the `base_url` variable to your server URL (default: `http://localhost:3000`).

## Deployment

### Railway

1. Push to GitHub
2. New Project → Deploy from GitHub repo
3. Add MySQL service
4. Set environment variables in Railway dashboard
5. Railway auto-assigns PORT — app reads `process.env.PORT`

### Render

1. New Web Service → connect GitHub
2. Build: `npm install` | Start: `npm start`
3. Add Render managed MySQL (or external)
4. Set env vars in Render dashboard

## Security Notes

- All SQL uses parameterized queries (no string interpolation)
- Input sanitized with `trim()` before storage
- `express-validator` rejects malformed data before controllers run
- `.env` never committed (in `.gitignore`)

## Screenshots

*[Add screenshots here]*

- Dashboard view
- Add School form
- Search results with distance badges

## License

MIT
