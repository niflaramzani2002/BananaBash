# 🍌 Banana Bash
# 🎮 Game Application

A full-stack game application built using the **MERN stack** with **JWT authentication**, **event-driven architecture**, and **Banana API integration**.

## 🚀 Features
- 🔑 **User Authentication** – Secure login & sign-up with JWT tokens
- 🏆 **Leaderboard System** – Track and display top scores
- 🎶 **Music Integration** – Background music for enhanced experience
- ⚡ **Dynamic Answer Option** – Interactive gameplay with real-time updates
- 💾 **Game Data Caching** – Faster loading and smooth gameplay

## 🧰 Technologies Used
**Frontend**
- React (hooks, context/state)
- React Router (routing)
- Fetch/Axios (API calls)
- CSS (custom styles)

**Backend**
- Node.js, Express.js (REST API)
- MongoDB & Mongoose (database & ODM)
- JSON Web Tokens (JWT) for auth
- bcrypt (password hashing)
- cors, dotenv, morgan (middleware/utilities)
- nodemon (dev runner)

**Integration**
- Banana API: https://marcconrad.com/uob/banana/api.php

## 🛠️ Tech Stack (Summary)
- **Frontend:** React.js, CSS  
- **Backend:** Node.js, Express.js, MongoDB, JWT  
- **API Integration:** Banana API

## 📂 Project Structure
### Backend
- `middleware/` – JWT authentication
- `models/` – User, Game, Score schemas
- `routes/` – Authentication, game logic, leaderboard
- `services/` – Game data handling
- `server.js` – Starts server & connects to MongoDB

### Frontend
- `components/` – UI components
- `styles/` – CSS
- `App.js` – Routing & state management
- `index.js` – Entry point

## ⚙️ Event-Driven Architecture
- **Login/Sign-In** → Validates user access
- **Button Clicks** → Trigger UI updates (e.g., leaderboard refresh)
- **Page Load** → Fetch game data with `useEffect`
- **API Requests** → `http://localhost:5000/api/game` fetches and serves data

## 🔐 Virtual Identity
- JWT stored in `localStorage`
- Auth middleware verifies token for protected routes
- Frontend guards sensitive pages based on auth state

## ▶️ Getting Started
```bash
# Clone the repository
git clone https://github.com/your-username/your-repo.git
cd your-repo

# Install backend dependencies
npm install

# Install frontend dependencies
cd client && npm install

# Run backend (root)
npm start

# Run frontend
cd client && npm start
