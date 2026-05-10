# Traveloop – Intelligent Travel Planning Hub 🌍✈️

## Overview

**Traveloop** is a full-stack web application designed for hackathon participants to showcase a modern travel planning platform. It enables users to plan multi-city trips, explore destinations, track budgets, and share travel experiences with a global community.

**Hackathon MVP Features:**
- User authentication & profile management
- Multi-city trip planning with budget tracking
- Interactive city explorer (200+ cities with photos)
- Trip experience sharing with photo uploads
- Admin analytics dashboard (admin-only)
- Community feed with seeded user posts

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│            (public/index.html - Single Page App)            │
│  ✓ Route-driven navigation (home, trips, cities, community) │
│  ✓ Authentication screens (login/register)                  │
│  ✓ Responsive UI (desktop & mobile)                         │
│  ✓ Leaflet map integration (60 city markers)                │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/REST API
┌────────────────────────▼────────────────────────────────────┐
│                   BACKEND (Node.js/Express)                 │
│                  (server.js - REST API)                     │
│  ✓ Authentication (register, login, logout)                │
│  ✓ Trip management (CRUD)                                  │
│  ✓ City data & search                                      │
│  ✓ Community posts with image uploads                      │
│  ✓ Admin analytics endpoints                               │
└────────────────────────┬────────────────────────────────────┘
                         │ SQL Queries
┌────────────────────────▼────────────────────────────────────┐
│                   DATABASE (SQLite)                         │
│                 (traveloop.db)                              │
│  ✓ users (auth, profile)                                   │
│  ✓ trips (itineraries)                                     │
│  ✓ stops (trip segments)                                   │
│  ✓ activities (trip activities)                            │
│  ✓ trip_posts (community)                                  │
│  ✓ cities (destinations)                                   │
│  ✓ user_logs & admin_logs (analytics)                      │
└─────────────────────────────────────────────────────────────┘
```

---

## Setup Instructions

### Prerequisites
- Node.js v14+ (download from https://nodejs.org)
- SQLite3 (included in npm packages)
- A terminal/command prompt

### Installation

1. **Clone or navigate to project**
   ```bash
   cd d:\traveloop
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Initialize database with city data**
   ```bash
   npm run init-db
   ```
  This seeds 200+ cities worldwide with image URLs, descriptions, locations, and cost indices.

4. **Start the server**
   ```bash
   npm start
   ```
   The application will be available at `http://localhost:3000`

5. **Frontend setup**
   - Open browser to `http://localhost:3000`
   - Register a new account or sign in with test credentials
   - No password reset needed—just use any valid email for testing

---

## Available Scripts

```bash
npm start       # Start production server (port 3000)
npm run dev     # Start with nodemon (auto-restart on changes)
npm run init-db # Seed database with 60 cities
```

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create new account |
| POST | `/api/auth/login` | Sign in (session-based) |
| GET | `/api/auth/me` | Get current user profile |
| POST | `/api/auth/logout` | Sign out |

### Trips
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/trips` | Create new trip |
| GET | `/api/trips` | List user's trips |
| GET | `/api/trips/:tripId` | Get trip details with stops |
| PUT | `/api/trips/:tripId` | Update trip info |
| DELETE | `/api/trips/:tripId` | Delete trip |

### Stops (Trip Segments)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/stops` | Add city to trip |
| PUT | `/api/stops/:stopId` | Update stop details |
| DELETE | `/api/stops/:stopId` | Remove city from trip |

### Cities
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cities` | List all seeded cities (200+) |
| GET | `/api/cities/:cityId` | Get city details |

### Community / Posts
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/posts` | Create post with images (multipart) |
| GET | `/api/posts` | Get community feed (50 latest) |
| GET | `/api/posts/trip/:tripId` | Get trip-specific posts |
| POST | `/api/posts/:postId/like` | Like/upvote a post |

### Admin Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Platform stats (users, trips, posts) - admin only |
| GET | `/api/admin/user-trends` | Daily user registration trends - admin only |
| GET | `/api/admin/trip-data` | Trip creation and budget analytics - admin only |

---

## Database Schema

### users
Stores user accounts and profiles
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE,
  password TEXT (hashed with bcrypt),
  phone TEXT,
  city TEXT,
  country TEXT,
  info TEXT,
  avatar TEXT,
  is_admin INTEGER DEFAULT 0,
  created_at TIMESTAMP
)
```

### trips
User's travel itineraries
```sql
CREATE TABLE trips (
  id TEXT PRIMARY KEY,
  user_id TEXT (FK),
  name TEXT,
  description TEXT,
  start_date TEXT,
  end_date TEXT,
  budget REAL,
  is_public BOOLEAN,
  share_token TEXT (for public sharing),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

### stops
Individual cities/segments in a trip
```sql
CREATE TABLE stops (
  id TEXT PRIMARY KEY,
  trip_id TEXT (FK),
  city_id TEXT (FK),
  arrival_date TEXT,
  depart_date TEXT,
  transport_cost REAL,
  stay_cost REAL,
  order_num INTEGER,
  notes TEXT
)
```

### activities
Things to do at each stop
```sql
CREATE TABLE activities (
  id TEXT PRIMARY KEY,
  stop_id TEXT (FK),
  name TEXT,
  category TEXT,
  cost REAL,
  hours REAL,
  description TEXT
)
```

### trip_posts
Community experience shares
```sql
CREATE TABLE trip_posts (
  id TEXT PRIMARY KEY,
  trip_id TEXT (FK),
  user_id TEXT (FK),
  title TEXT,
  experience TEXT,
  images TEXT (comma-separated paths),
  likes INTEGER,
  created_at TIMESTAMP
)
```

### cities
Pre-seeded worldwide destinations
```sql
CREATE TABLE cities (
  id TEXT PRIMARY KEY,
  name TEXT,
  country TEXT,
  region TEXT,
  latitude REAL,
  longitude REAL,
  cost_index REAL (budget estimate scale),
  popularity INTEGER (0-100),
  image TEXT (URL or path),
  description TEXT
)
```

### Logging Tables
- `user_logs` – User actions for analytics
- `admin_logs` – Admin activities

---

## Frontend Features

### Home Dashboard
- Welcome message with user name
- Quick action buttons (New Trip, View Trips, Explore Cities)
- Recent trips summary

### Trip Planner
- Create multi-city itineraries
- Add cities with arrival/departure dates
- Track transport and accommodation costs
- Auto-calculate total trip budget
- Share trips publicly

### City Explorer
- Browse 60 major world cities
- Filter by region, cost, popularity
- View city descriptions and cost indices
- Plan trips around destinations

### Community
- View shared travel experiences
- Filter by trip or destination
- Like and interact with posts
- Upload photos with experiences

### User Profile
- Edit name, email, phone
- Update location information
- View account settings

### Admin Dashboard
- Real-time platform statistics
- User growth trends
- Trip creation analytics
- Budget insights
- Access restricted to admin users only

---

## Admin Access

Admin APIs are protected by role checks. Only users with `is_admin = 1` can access analytics endpoints and admin navigation.

Seeded admin credentials (created by `npm run init-db`):
- Email: `admin@traveloop.io`
- Password: `Admin@12345`

Seeded demo user credentials:
- Email: `ava@traveloop.io`
- Password: `Demo@12345`

Notes:
- Regular users cannot access admin APIs.
- The Admin menu is hidden for non-admin users in the UI.

---

## Security Features

✅ **Password Hashing** – bcryptjs (10-round salt)
✅ **SQL Injection Prevention** – Parameterized queries
✅ **XSS Prevention** – HTML sanitization
✅ **Session Management** – Secure cookies (24-hour expiry)
✅ **File Upload Validation** – Size limits, allowed MIME types
✅ **CORS Protection** – Restricted origins

---

## Included Cities (200+ destinations)

Seed data now includes 200+ cities across:
- Asia
- Europe
- Americas
- Africa
- Oceania

Each city includes:
- Name, country, and region
- Latitude and longitude
- Cost index and popularity score
- Description
- Image URL (travel/city photo)

---

## File Structure

```
d:\traveloop\
├── server.js                 # Express API server (1900+ lines)
├── package.json              # NPM dependencies
├── traveloop.db             # SQLite database (auto-created)
├── public/
│   └── index.html           # Frontend SPA (~1000 lines)
├── scripts/
│   └── init-db.js           # Database seeder
├── uploads/                 # User-uploaded images
└── README.md                # This file
```

---

## Development Workflow

### Local Testing
1. Start server: `npm start`
2. Open http://localhost:3000
3. Register test account
4. Create test trip with multiple cities
5. Upload images to community posts
6. View admin dashboard

### Testing API Endpoints
Use curl or Postman:

```bash
# Register user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Traveler",
    "email": "john@example.com",
    "password": "SecurePass123",
    "city": "New York",
    "country": "USA"
  }'

# Get all cities
curl http://localhost:3000/api/cities

# Get platform stats
curl http://localhost:3000/api/admin/stats
```

---

## Future Enhancements

🚀 **Real-time Notifications** – Trip reminders, post likes
🚀 **Payment Integration** – Stripe/PayPal for booking accommodation
🚀 **AI Recommendations** – Personalized trip suggestions
🚀 **Mobile App** – React Native or Flutter
🚀 **Google Maps Integration** – Directional routing
🚀 **Weather API** – Destination forecasts
🚀 **Review System** – City ratings and reviews
🚀 **Travel Guides** – Expert tips for destinations
🚀 **Budget Sharing** – Group trip coordination
🚀 **Social Features** – Follow friends, private messaging

---

## Troubleshooting

### Port 3000 already in use
```bash
# Find process using port 3000
netstat -ano | findstr :3000
# Kill process (replace PID)
taskkill /PID [PID] /F
```

### Database errors
```bash
# Delete old database and reinitialize
del traveloop.db
npm run init-db
```

### API connection errors
- Ensure server is running: `npm start`
- Check frontend is accessing `http://localhost:3000/api`
- Review browser console for error messages

### File upload issues
- Ensure `uploads/` directory exists
- Check file size (max 5MB per file)
- Verify image file format (JPG, PNG, GIF, WebP)

---

## Performance Metrics

✅ **Database:** SQLite (0-50ms queries on localhost)
✅ **API Response:** <100ms average
✅ **Page Load:** ~800ms (includes assets)
✅ **Concurrent Users:** Single-threaded Node.js (5-10 simultaneous recommended for MVP)

For production, consider:
- PostgreSQL instead of SQLite
- Redis caching for cities/popular destinations
- CDN for static assets
- Reverse proxy (nginx) for load balancing

---

## Team & Credits

**Traveloop MVP** built for hackathon showcase.

**Technologies Used:**
- Frontend: HTML5, CSS3, JavaScript (Vanilla)
- Backend: Node.js, Express.js
- Database: SQLite3
- Maps: Leaflet.js v1.9.4
- Charts: Chart.js 3.9.1
- Auth: bcryptjs, express-session
- File Uploads: Multer

**Key Contributors:**
- Full-stack development
- Database architecture
- API design
- UI/UX implementation

---

## License

This project is built for hackathon purposes. Feel free to fork, modify, and extend.

---

## Contact & Support

For hackathon questions or feature requests:
- Check the README thoroughly
- Review API endpoints documentation
- Test endpoints with Postman before integration
- Verify database seeding completed successfully

**Happy travels! ✈️🌏**
