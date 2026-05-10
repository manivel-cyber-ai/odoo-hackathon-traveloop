# Traveloop – Modern Travel Planning Platform 🌍✈️

A full-stack, production-ready travel planning web application built with Node.js and Vanilla JavaScript. Explore 378 global cities, plan multi-city trips, share experiences with a community, and manage travel data with a secure role-based admin dashboard.

---

## 📋 Table of Contents

1. [Quick Start](#-quick-start)
2. [Project Overview](#-project-overview)
3. [Architecture](#-architecture)
4. [Database Schema](#-database-schema)
5. [API Endpoints](#-api-endpoints)
6. [Features](#-features)
7. [Tech Stack](#-tech-stack)
8. [File Structure](#-file-structure)
9. [Configuration](#-configuration)
10. [Deployment](#-deployment)

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v14+ ([Download](https://nodejs.org))
- **npm** (comes with Node.js)
- Command line/terminal

### Installation (5 minutes)

```bash
# 1. Clone/navigate to project
cd d:\traveloop

# 2. Install dependencies
npm install

# 3. Initialize database with seed data
npm run init-db

# 4. Start development server
npm start

# 5. Open in browser
# http://localhost:3001
```

### Test Accounts
```
ADMIN:
  Email:    admin@traveloop.io
  Password: Admin@12345

DEMO USER:
  Email:    ava@traveloop.io
  Password: Demo@12345
```

---

## 📚 Project Overview

### What is Traveloop?

Traveloop is a complete travel planning platform that helps users:
- **Discover destinations** from a database of 378 cities worldwide
- **Plan multi-city trips** with automatic budget calculations
- **Share experiences** via community posts and reviews
- **Track travel preferences** (costs, popular destinations, activities)
- **Manage itineraries** with detailed city information

### Key Stats

| Metric | Value |
|--------|-------|
| **Cities** | 378 global destinations |
| **Users** | 7 demo accounts (1 admin, 6 regular) |
| **Community Posts** | 15+ sample posts |
| **API Routes** | 20+ endpoints |
| **Database Tables** | 8 tables (normalized) |
| **Deployable** | Yes (Heroku, Render, Railway) |

---

## 🏗️ Architecture

### System Design

```
┌─────────────────────────────────────────────┐
│         CLIENT (Browser/Frontend)            │
│  • Vanilla JavaScript (no frameworks)        │
│  • CSS3 with responsive design               │
│  • Leaflet.js for interactive maps           │
│  • Single-Page Application (SPA)             │
└─────────────┬───────────────────────────────┘
              │ HTTP/AJAX
┌─────────────▼───────────────────────────────┐
│      SERVER (Node.js/Express.js)            │
│  • RESTful API endpoints                     │
│  • Session-based authentication              │
│  • Role-based access control (RBAC)         │
│  • Static file serving                       │
└─────────────┬───────────────────────────────┘
              │ SQL Queries
┌─────────────▼───────────────────────────────┐
│      DATABASE (SQLite)                      │
│  • Normalized schema (8 tables)              │
│  • Foreign key relationships                 │
│  • Indexed columns for performance           │
└─────────────────────────────────────────────┘
```

### Request Flow Example

```
User clicks "Add City to Trip"
  ↓
JavaScript sends AJAX POST to /api/trips/:tripId/stops
  ↓
Express.js receives request
  ↓
Middleware checks user authentication & authorization
  ↓
SQL query inserts city into trip_stops table
  ↓
Response JSON sent back to client
  ↓
Frontend updates DOM and shows success toast
```

---

## 🗄️ Database Schema

### Tables Overview

#### 1. **users** (Authentication & Authorization)
```sql
id          INTEGER PRIMARY KEY
email       TEXT UNIQUE
username    TEXT
password    TEXT (bcrypt hashed)
is_admin    BOOLEAN (0=user, 1=admin)
created_at  TIMESTAMP
```

**Seed Data:**
- 1 admin: `admin@traveloop.io`
- 6 demo users: `ava@traveloop.io`, `noah@traveloop.io`, etc.

---

#### 2. **cities** (Destination Information)
```sql
id          INTEGER PRIMARY KEY
name        TEXT UNIQUE
country     TEXT
region      TEXT (Asia, Europe, Americas, Africa, Oceania)
latitude    REAL
longitude   REAL
cost_index  REAL ($/day average)
popularity  INTEGER (0-100%)
image       TEXT (SVG placeholder)
description TEXT
```

**Seed Data:** 378 cities across 5 regions
- Asia: 80 cities (Tokyo, Beijing, Bangkok, etc.)
- Europe: 90 cities (Paris, London, Rome, etc.)
- Americas: 90 cities (New York, Los Angeles, etc.)
- Africa: 70 cities (Cairo, Nairobi, etc.)
- Oceania: 40 cities (Sydney, Auckland, etc.)

---

#### 3. **trips** (User Itineraries)
```sql
id          INTEGER PRIMARY KEY
user_id     FOREIGN KEY → users.id
title       TEXT
description TEXT
budget      REAL (calculated)
created_at  TIMESTAMP
```

---

#### 4. **trip_stops** (Cities in Each Trip)
```sql
id          INTEGER PRIMARY KEY
trip_id     FOREIGN KEY → trips.id
city_id     FOREIGN KEY → cities.id
order       INTEGER (sequence in trip)
```

---

#### 5. **trip_posts** (Community Posts)
```sql
id          INTEGER PRIMARY KEY
user_id     FOREIGN KEY → users.id
title       TEXT
content     TEXT
likes       INTEGER
created_at  TIMESTAMP
```

---

#### 6. **activities** (City Activities)
```sql
id          INTEGER PRIMARY KEY
city_id     FOREIGN KEY → cities.id
name        TEXT
category    TEXT (museum, food, nature, etc.)
```

---

#### 7. **admin_logs** (Admin Action Logging)
```sql
id          INTEGER PRIMARY KEY
admin_id    FOREIGN KEY → users.id
action      TEXT
timestamp   TIMESTAMP
```

---

#### 8. **user_logs** (Activity Tracking)
```sql
id          INTEGER PRIMARY KEY
user_id     FOREIGN KEY → users.id
action      TEXT
timestamp   TIMESTAMP
```

---

## 🔌 API Endpoints

### Authentication Routes

```
POST   /api/auth/register        Create new account
POST   /api/auth/login           Sign in (session-based)
GET    /api/auth/me              Get current user
POST   /api/auth/logout          Sign out
```

### Trip Management Routes

```
GET    /api/trips                List user's trips
POST   /api/trips                Create new trip
GET    /api/trips/:id            Get trip details
PUT    /api/trips/:id            Update trip
DELETE /api/trips/:id            Delete trip
POST   /api/trips/:id/stops      Add city to trip
DELETE /api/trips/:id/stops/:sid Remove city from trip
```

### City Routes

```
GET    /api/cities               List 378 cities
GET    /api/cities/:id           Get city details
GET    /api/cities/:id/info      Full city information
```

### Community Routes

```
GET    /api/posts                List all posts
POST   /api/posts                Create new post
POST   /api/posts/:id/like       Like a post
DELETE /api/posts/:id            Delete post
```

### Admin Routes (requires admin role)

```
GET    /api/admin/stats          Platform statistics
GET    /api/admin/users          List all users
GET    /api/admin/logs           View admin logs
```

### Image Route

```
GET    /api/image/placeholder/:city   Get SVG placeholder for city
```

---

## ✨ Features

### 1. **City Explorer**
- Browse 378 destinations worldwide
- Search and filter cities
- View detailed city profiles
- Interactive Leaflet map with markers
- Cost and popularity stats
- Activities & things to do

### 2. **Trip Planning**
- Create multi-city itineraries
- Add/remove cities from trips
- Automatic budget calculation
- Trip descriptions and notes
- Save and edit trips

### 3. **Community**
- Share travel experiences
- Post tips and photos
- Like and interact with posts
- Browse other travelers' posts
- Real-time feed

### 4. **Authentication**
- Email-based registration & login
- Secure password hashing (bcryptjs)
- Session-based persistence
- 24-hour session timeout
- Remember me functionality

### 5. **Admin Dashboard**
- Platform statistics
- User management
- Trip analytics
- Content moderation
- Admin action logging

### 6. **Responsive Design**
- Mobile-first approach
- CSS Grid & Flexbox
- Optimized for all screen sizes
- Touch-friendly buttons
- Fast load times

---

## 💻 Tech Stack

### Backend
- **Runtime:** Node.js v14+
- **Framework:** Express.js
- **Database:** SQLite3
- **Auth:** bcryptjs (password hashing), express-session
- **Validation:** Custom middleware

### Frontend
- **Language:** Vanilla JavaScript (no frameworks)
- **Maps:** Leaflet.js v1.9.4
- **Styling:** Modern CSS3 (gradients, animations, transitions)
- **Architecture:** Single-Page Application (SPA)
- **Routing:** Hash-based routing (#/route)

### DevOps
- **Version Control:** Git + GitHub
- **Package Manager:** npm
- **Deployment:** Ready for Heroku, Render, Railway
- **Environment:** .env configuration

---

## 📁 File Structure

```
traveloop/
├── server.js                    # Main Express server (2000+ lines)
├── public/
│   ├── index.html              # Single-page app (HTML + inline JS/CSS)
│   └── js/
│       └── image-manager.js    # Image utilities
├── scripts/
│   ├── init-db.js              # Database initialization
│   ├── get-city-images.js      # Image downloader (Pexels)
│   └── download-remaining-images.js
├── uploads/
│   ├── cities/                 # City images folder
│   └── .gitkeep
├── package.json                # Dependencies
├── .env                        # Environment variables
├── .gitignore                  # Git ignore rules
├── README.md                   # This file
├── GETTING_STARTED.md          # Quick start guide
└── traveloop.db                # SQLite database (auto-created)
```

---

## ⚙️ Configuration

### Environment Variables (.env)

```env
# Server
PORT=3001
NODE_ENV=development

# Database
DATABASE_PATH=./traveloop.db

# Security
SESSION_SECRET=your-secret-key-change-in-production

# File Upload
UPLOAD_LIMIT=5242880        # 5MB
MAX_FILES=5
```

### Dependencies

```json
{
  "express": "^4.18.0",
  "sqlite3": "^5.1.0",
  "bcryptjs": "^2.4.0",
  "express-session": "^1.17.0",
  "dotenv": "^16.0.0",
  "cors": "^2.8.0"
}
```

---

## 🚀 Deployment

### Heroku

```bash
# 1. Install Heroku CLI
# Download from https://devcenter.heroku.com/articles/heroku-cli

# 2. Login
heroku login

# 3. Create app
heroku create your-app-name

# 4. Set environment variables
heroku config:set SESSION_SECRET=your-secret-key
heroku config:set NODE_ENV=production

# 5. Deploy
git push heroku main
```

### Render

```bash
# 1. Connect GitHub repo to Render
# https://render.com/

# 2. Create new Web Service
# Select: Node
# Build command: npm install
# Start command: npm start

# 3. Set environment variables in dashboard
# PORT, SESSION_SECRET, DATABASE_PATH, etc.

# 4. Deploy on push to main branch
```

### Railway

```bash
# 1. Install Railway CLI
# https://railway.app/

# 2. Login
railway login

# 3. Initialize project
railway init

# 4. Deploy
railway up
```

---

## 🔒 Security Features

1. **Password Security**
   - bcryptjs with 10 salt rounds
   - Never stored in plain text
   - Compared securely during login

2. **Session Management**
   - 24-hour session expiry
   - Secure session cookies
   - CSRF protection via middleware

3. **Database Security**
   - Parameterized queries (prevent SQL injection)
   - Foreign key constraints
   - Input validation

4. **Role-Based Access Control**
   - Admin-only endpoints
   - User authentication checks
   - Authorization middleware

5. **Error Handling**
   - No sensitive data in error messages
   - Logging of failed auth attempts
   - Graceful error responses

---

## 📊 Sample Data

### Pre-seeded Cities (378 total)

**Asia (80 cities)**
Tokyo, Osaka, Kyoto, Sapporo, Seoul, Busan, Bangkok, Phuket, Singapore, Kuala Lumpur, Beijing, Shanghai, Chengdu, Xi'an, Hong Kong, Macau, Taipei, Hanoi, Ho Chi Minh, Phnom Penh, ...

**Europe (90 cities)**
London, Paris, Berlin, Amsterdam, Barcelona, Rome, Venice, Florence, Vienna, Prague, Munich, Madrid, Lisbon, Dublin, Edinburgh, Stockholm, Copenhagen, ...

**Americas (90 cities)**
New York, Los Angeles, Chicago, Houston, Miami, Toronto, Vancouver, Mexico City, Rio de Janeiro, São Paulo, Buenos Aires, Santiago, Lima, ...

**Africa (70 cities)**
Cairo, Nairobi, Lagos, Cape Town, Johannesburg, Marrakech, Casablanca, ...

**Oceania (40 cities)**
Sydney, Melbourne, Auckland, Brisbane, Perth, Wellington, ...

### Sample Users

- Admin: `admin@traveloop.io` / `Admin@12345`
- User 1: `ava@traveloop.io` / `Demo@12345`
- User 2: `noah@traveloop.io` / `Demo@12345`
- User 3: `mia@traveloop.io` / `Demo@12345`
- User 4: `lucas@traveloop.io` / `Demo@12345`
- User 5: `emma@traveloop.io` / `Demo@12345`

---

## 🎯 Use Cases

### Personal Use
- Plan your dream vacation
- Track visited cities
- Share travel experiences
- Get inspiration from community

### Learning
- Full-stack web development
- Database design & normalization
- RESTful API design
- Session-based authentication

### Portfolio
- Showcase full-stack skills
- Demonstrate database knowledge
- Show frontend/backend abilities
- Production-ready code

### Hackathon
- Complete project submission
- Impressive demo
- Pre-populated data ready to go
- Mobile-responsive design

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is open source and available under the MIT License.

---

## 🙋 Support

For questions or issues:
1. Check [GETTING_STARTED.md](GETTING_STARTED.md) for quick start help
2. Review API documentation above
3. Check error logs in terminal
4. Create an issue on GitHub

---

## 🎉 Credits

Built with ❤️ for modern travel planning.

- **Database:** SQLite3
- **Maps:** Leaflet.js
- **Icon:** Emojis
- **Inspiration:** Real travel planning needs

---

## 📈 Future Enhancements

Potential features to add:
- [ ] Real city images integration
- [ ] Advanced trip recommendations
- [ ] Booking integrations (flights, hotels)
- [ ] Payment processing
- [ ] Real-time notifications
- [ ] Social sharing features
- [ ] Mobile app (React Native)
- [ ] Advanced filtering & search
- [ ] Weather data integration
- [ ] Currency conversion

---

**Happy traveling! 🌍✈️**

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
