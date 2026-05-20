# URL Shortener Backend

A Node.js backend server for the URL Shortener application built with Express.js and MongoDB.

## Features

- User authentication with JWT tokens
- URL shortening functionality
- Secure routes with middleware
- RESTful API endpoints
- MongoDB database integration

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## Installation

1. Navigate to the Backend directory:
```bash
cd Backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the Backend directory with the following variables:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
NODE_ENV=development
```

## Project Structure

```
Backend/
├── Controllers/
│   ├── authController.js    # Authentication logic
│   └── urlController.js     # URL shortening logic
├── Middlewares/
│   └── authMiddleware.js    # JWT authentication middleware
├── Models/
│   ├── User.js              # User schema
│   └── Url.js               # URL schema
├── Routes/
│   ├── authRoutes.js        # Auth endpoints
│   └── urlRoutes.js         # URL endpoints
├── Server.js                # Main server file
├── package.json
└── README.md
```

## API Endpoints

### Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user

### URL Shortening

- `GET /urls` - Get all shortened URLs for authenticated user
- `POST /shorten` - Create a new shortened URL
- `GET /:shortCode` - Redirect to original URL

## Running the Server

Start the development server:
```bash
npm start
```

The server will run on `http://localhost:5000` by default.

## Database Models

### User Schema
- `email` - User email (unique)
- `password` - Hashed password
- `createdAt` - Account creation timestamp

### URL Schema
- `shortUrl` - Generated short URL
- `longUrl` - Original long URL
- `shortCode` - Short code identifier
- `userId` - Reference to user
- `createdAt` - Creation timestamp

## Environment Variables

- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)

## Technologies Used

- Express.js - Web framework
- MongoDB - Database
- Mongoose - ODM for MongoDB
- JWT - Authentication
- bcryptjs - Password hashing
