# Group Trip Budget Calculator 💰✈️

A full-stack web application that helps groups of people manage shared expenses during trips. Users can log in, create trips, add members, track expenses, and automatically calculate who owes whom.

## 🎯 Features

- **User Authentication**: Secure login/logout with JWT tokens
- **Trip Management**: Create and manage multiple trips
- **Expense Tracking**: Log all expenses with detailed information
- **Smart Calculations**: Automatically calculates who owes whom
- **Settlement Suggestions**: Get smart recommendations for settling debts
- **User Dashboard**: View all trips and expense summaries

## 🏗️ Architecture

```
Group_trip_Budget_calculator/
├── backend/           # Node.js + Express API
│   ├── config/       # Database & environment config
│   ├── models/       # MongoDB schemas
│   ├── routes/       # API endpoints
│   ├── middleware/   # Authentication & validation
│   ├── controllers/  # Business logic
│   └── server.js     # Main server file
├── frontend/         # React.js application
│   ├── public/       # Static files
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── context/     # Auth context
│   │   ├── services/    # API calls
│   │   └── App.js
│   └── package.json
└── database/         # Database schemas & setup
```

## 🚀 Tech Stack

**Frontend:**
- React.js
- React Router
- Context API (Authentication)
- Axios (API calls)
- CSS/Bootstrap

**Backend:**
- Node.js
- Express.js
- MongoDB
- JWT (JSON Web Tokens)
- bcryptjs (Password hashing)

**Database:**
- MongoDB (NoSQL)

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14+)
- MongoDB
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## 🔐 Authentication Flow

1. User registers with email & password
2. Password is hashed using bcryptjs
3. On login, JWT token is issued
4. Token stored in localStorage (frontend)
5. Token sent in Authorization header for protected routes
6. Logout clears token

## 📱 API Endpoints

### Auth Routes
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Trip Routes
- `POST /api/trips` - Create trip
- `GET /api/trips` - Get all user trips
- `GET /api/trips/:id` - Get trip details

### Expense Routes
- `POST /api/expenses` - Add expense
- `GET /api/expenses/:tripId` - Get trip expenses
- `POST /api/expenses/calculate-settlement/:tripId` - Get settlement details

## 📝 License

MIT
