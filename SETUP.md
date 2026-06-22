# Project Setup Guide

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB running locally or MongoDB Atlas connection string
- npm or yarn

## Backend Setup

### 1. Navigate to backend folder
```bash
cd backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create `.env` file
Copy from `.env.example`:
```bash
cp .env.example .env
```

Update `.env` with your MongoDB URI and JWT secret:
```
MONGODB_URI=mongodb://localhost:27017/group_trip_budget
PORT=5000
JWT_SECRET=your_secure_jwt_secret_key
NODE_ENV=development
```

### 4. Start the backend server
```bash
npm start
```

Server will run on `http://localhost:5000`

## Frontend Setup

### 1. Navigate to frontend folder
```bash
cd frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create `.env` file (optional)
```bash
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Start the frontend development server
```bash
npm start
```

App will open on `http://localhost:3000`

## Database Setup

### MongoDB Local Setup
1. Install MongoDB from https://www.mongodb.com/try/download/community
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/group_trip_budget`

### MongoDB Atlas Setup
1. Create account on https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string
4. Update `.env` file with your connection string

## Project Structure

```
Group_trip_Budget_calculator/
├── backend/
│   ├── models/              # Database schemas
│   │   ├── User.js
│   │   ├── Trip.js
│   │   └── Expense.js
│   ├── routes/              # API endpoints
│   │   ├── auth.js
│   │   ├── trips.js
│   │   └── expenses.js
│   ├── middleware/          # Custom middleware
│   │   └── auth.js          # JWT authentication
│   ├── server.js            # Main server file
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/      # Reusable components
    │   │   ├── Navigation.js
    │   │   └── ProtectedRoute.js
    │   ├── context/         # React context
    │   │   └── AuthContext.js
    │   ├── pages/           # Page components
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── Dashboard.js
    │   │   └── CreateTrip.js
    │   ├── services/        # API calls
    │   │   └── api.js
    │   ├── styles/          # CSS files
    │   ├── App.js
    │   └── index.js
    └── package.json
```

## Features

### Authentication
- **Register**: Create new account with email and password
- **Login**: Secure login with JWT tokens
- **Logout**: Clear session and token

### Trip Management
- **Create Trip**: Plan a new trip
- **View Trips**: See all your trips
- **Delete Trip**: Remove trips

### Expense Tracking
- **Add Expense**: Log expenses during trip
- **View Expenses**: See all trip expenses
- **Calculate Settlement**: Get smart settlement suggestions

## API Endpoints

### Auth
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Trips
- `POST /api/trips` - Create trip
- `GET /api/trips` - Get all user trips
- `GET /api/trips/:id` - Get trip details
- `PUT /api/trips/:id` - Update trip
- `DELETE /api/trips/:id` - Delete trip
- `POST /api/trips/:id/members` - Add member

### Expenses
- `POST /api/expenses` - Create expense
- `GET /api/expenses/:tripId` - Get trip expenses
- `DELETE /api/expenses/:id` - Delete expense
- `POST /api/expenses/calculate-settlement/:tripId` - Get settlement

## Technologies Used

**Backend:**
- Express.js
- MongoDB
- JWT
- bcryptjs

**Frontend:**
- React.js
- React Router
- Bootstrap
- Axios

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string in `.env`
- For Atlas, whitelist your IP address

### CORS Error
- Backend has CORS enabled
- Check frontend API URL in axios calls

### Token Expiration
- Token expires in 7 days
- User needs to login again after expiration

## License

MIT
