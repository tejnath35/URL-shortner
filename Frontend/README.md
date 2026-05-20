# URL Shortener Frontend

A React frontend application for the URL Shortener service built with Vite, React Router, and Tailwind CSS.

## Features

- User registration and login
- URL shortening interface
- Display of previously shortened URLs
- Copy to clipboard functionality
- Responsive design
- Dark theme UI

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Navigate to the Frontend directory:
```bash
cd Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the Frontend directory with the following variables:
```
VITE_API_BASE_URL=http://localhost:5000
```

## Project Structure

```
Frontend/
├── src/
│   ├── Components/
│   │   ├── Navbar.jsx      # Navigation component
│   │   ├── UrlForm.jsx     # URL input form
│   │   └── UrlList.jsx     # List of shortened URLs
│   ├── Pages/
│   │   ├── Dashboard.jsx   # Main dashboard page
│   │   ├── Login.jsx       # Login page
│   │   └── Register.jsx    # Registration page
│   ├── App.jsx             # Main app component
│   ├── App.css             # Global styles
│   ├── index.css           # Global CSS with Tailwind
│   └── main.jsx            # Entry point
├── index.html
├── vite.config.js
├── eslint.config.js
├── package.json
└── README.md
```

## Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5174` (or the next available port if 5174 is in use).

## Building

Create a production build:
```bash
npm run build
```

The optimized build will be in the `dist/` directory.

## Preview Production Build

Preview the production build locally:
```bash
npm run preview
```

## Linting

Run ESLint to check code quality:
```bash
npm run lint
```

## Pages

### Login
- Email and password authentication
- Link to registration page
- Stores JWT token in localStorage

### Register
- Create new account with email and password
- Redirects to dashboard after registration
- Link to login page

### Dashboard
- Main application interface
- URL shortening form
- List of user's shortened URLs
- Copy button for each shortened URL
- Logout functionality

## Components

### UrlForm
- Input field for long URLs
- Submit button with loading state
- Form validation

### UrlList
- Displays all shortened URLs for user
- Shows original and shortened URLs
- Copy to clipboard functionality
- Loading state indicator

## Technologies Used

- React 19.2.6 - UI framework
- Vite 8.0.12 - Build tool
- React Router 7.15.1 - Routing
- Tailwind CSS 4.3.0 - Styling
- ESLint - Code quality

## Environment Variables

- `VITE_API_BASE_URL` - Backend API base URL (default: http://localhost:5000)

## API Integration

The frontend communicates with the backend API at the endpoint specified in `VITE_API_BASE_URL`.

### Authentication Flow
1. User registers or logs in
2. Backend returns JWT token
3. Token stored in localStorage
4. Token included in all subsequent API requests
5. 401 responses trigger redirect to login

## Styling

- Uses Tailwind CSS for utility-based styling
- Dark theme with purple accents
- Responsive design for mobile and desktop
- Custom CSS in App.css for specific components
