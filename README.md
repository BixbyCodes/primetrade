# Primetrade Task Manager API

A scalable REST API with JWT authentication, role-based access control (RBAC), and a React frontend.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Validation | express-validator |
| Security | helmet, express-mongo-sanitize, rate-limiting |
| Docs | Swagger (OpenAPI 3.0) |
| Frontend | React 18 + Vite |

---

## Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB (local or Atlas)

### Backend Setup

```bash
cd backend
npm install

# Copy env file and fill in your values
cp .env.example .env
# Set MONGO_URI, JWT_SECRET etc.

npm run dev   # development
npm start     # production
```

Server runs at: http://localhost:5001
Swagger docs: http://localhost:5001/api-docs

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

App runs at: `http://localhost:5173`

---

## API Endpoints (v1)

### Auth  `POST /api/v1/auth/`
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| POST | /auth/register | Register new user | No |
| POST | /auth/login | Login, returns JWT | No |
| GET | /auth/me | Get current user | Yes |

### Tasks  `*  /api/v1/tasks/`
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| GET | /tasks | Get own tasks (filter + paginate) | Yes |
| POST | /tasks | Create task | Yes |
| GET | /tasks/:id | Get single task | Yes |
| PUT | /tasks/:id | Update task | Yes |
| DELETE | /tasks/:id | Delete task | Yes |

### Admin  `/api/v1/admin/`
| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | /admin/stats | Dashboard stats | Admin |
| GET | /admin/users | All users | Admin |
| PATCH | /admin/users/:id/toggle | Toggle user active | Admin |
| GET | /admin/tasks | All tasks | Admin |

---

## Project Structure

```
backend/
├── server.js                    # Entry point
└── src/
    ├── config/swagger.js        # Swagger config
    ├── controllers/             # Route handlers
    │   ├── authController.js
    │   ├── taskController.js
    │   └── adminController.js
    ├── middlewares/
    │   ├── auth.js              # JWT verification
    │   ├── roleCheck.js         # RBAC middleware
    │   └── errorHandler.js      # Global error handler
    ├── models/
    │   ├── User.js
    │   └── Task.js
    ├── routes/v1/               # Versioned routes
    │   ├── auth.routes.js
    │   ├── task.routes.js
    │   └── admin.routes.js
    ├── validators/              # Input validation rules
    └── utils/                   # ApiError, ApiResponse, asyncHandler

frontend/
└── src/
    ├── api/                     # Axios API calls
    ├── components/              # Reusable UI components
    ├── context/AuthContext.jsx  # Global auth state
    └── pages/                   # Login, Register, Dashboard, AdminPanel
```

---

## Security Practices

- Passwords hashed with **bcryptjs** (salt rounds: 12)
- **JWT** tokens with configurable expiry (default 7 days)
- **Helmet.js** sets secure HTTP headers
- **express-mongo-sanitize** prevents NoSQL injection
- **express-rate-limit** — 100 req/15min per IP
- Input validated with **express-validator** on every endpoint
- CORS restricted to frontend origin only
- Request body size limited to 10kb

---

## Creating an Admin User

After running the backend, use this one-time script or manually set role in MongoDB:

```js
// Run in MongoDB shell or Compass
db.users.updateOne({ email: "admin@example.com" }, { $set: { role: "admin" } })
```

---

## Environment Variables

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/primetrade
JWT_SECRET=change_this_to_a_long_random_string
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```
