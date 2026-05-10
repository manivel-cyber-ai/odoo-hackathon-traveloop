# Traveloop – Hackathon Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install & Setup (2 min)
```bash
cd d:\traveloop
npm install
npm run init-db
```

### Step 2: Start Server (1 min)
```bash
npm start
```
✅ Server running at http://localhost:3000

### Step 3: Open Frontend (1 min)
- Open browser → http://localhost:3000
- Click "Register" or "Sign In"

### Step 4: Create Your First Trip (1 min)
1. Sign in / Register
2. Click "New Trip" button
3. Fill in trip details
4. Click "Create Trip"
5. Add cities from the list
6. View trip itinerary

---

## 🎯 Key Features to Demo

### Authentication Flow
- **Register:** Create new account with email/password
- **Login:** Session-based authentication
- **Profile:** View and edit user information

### Trip Planning
- **Create Trip:** Multi-city itineraries with budget
- **Add Cities:** Select from 60 global destinations
- **Track Costs:** Transport + accommodation per stop
- **Share:** Make trips public for others

### Community
- **Post Experience:** Share trip photos and stories
- **Like Posts:** Engage with community content
- **View Feed:** See other travelers' experiences

### Admin Dashboard
- **Statistics:** Users, trips, posts counts
- **Trends:** User growth over time
- **Analytics:** Trip creation and budget data
- Access at: http://localhost:3000/admin.html

---

## 📋 API Endpoints (Quick Reference)

### Auth
```
POST /api/auth/register     → Create account
POST /api/auth/login        → Sign in
GET  /api/auth/me           → Current user
POST /api/auth/logout       → Sign out
```

### Trips
```
POST   /api/trips           → Create trip
GET    /api/trips           → List user trips
GET    /api/trips/:tripId   → Get trip details
PUT    /api/trips/:tripId   → Update trip
DELETE /api/trips/:tripId   → Delete trip
```

### Cities
```
GET /api/cities             → List 60 cities
GET /api/cities/:cityId     → City details
```

### Community
```
POST /api/posts             → Create post with images
GET  /api/posts             → Community feed
POST /api/posts/:id/like    → Like a post
```

### Admin
```
GET /api/admin/stats        → Platform stats
GET /api/admin/user-trends  → User growth
GET /api/admin/trip-data    → Trip analytics
```

---

## 🗄️ Database Structure

8 Tables (auto-created):
- `users` – Accounts & profiles
- `trips` – Itineraries
- `stops` – Cities in trips
- `activities` – Things to do
- `trip_posts` – Community posts
- `cities` – 60 destinations
- `user_logs` – User activity tracking
- `admin_logs` – Admin actions

Seeded with 20+ demo cities worldwide.

---

## 🎨 UI Highlights

**Responsive Design:**
- Desktop: Sidebar nav + main content
- Mobile: Stacked layout, hidden sidebar during auth

**Color Scheme:**
- Gold (#f7c948) – Primary actions
- Teal (#46d6b2) – Secondary highlights
- Blue (#6ea8ff) – Links & accent
- Dark background with light text for accessibility

**Screens:**
1. Login / Register (auth-mode)
2. Home Dashboard
3. Trip Manager
4. Trip Details with Itinerary
5. City Explorer
6. Community Feed
7. User Profile
8. Admin Analytics

---

## 🛠️ Technology Stack

**Frontend:**
- HTML5 / CSS3 / Vanilla JavaScript
- Leaflet.js (maps)
- Chart.js (analytics)
- No build step needed

**Backend:**
- Node.js + Express.js
- SQLite3 database
- bcryptjs (password hashing)
- Multer (file uploads)
- express-session (auth)

**Deployment Ready:**
- All dependencies in package.json
- Database auto-initializes
- Env config via .env file

---

## 💡 Demo Script

### 1. Register New User (30 sec)
- Go to http://localhost:3000
- Click "Register"
- Fill email, password, name, city
- Submit

### 2. Create Trip (30 sec)
- Click "New Trip"
- Enter: "Europe Adventure", dates, $5000 budget
- Save

### 3. Add Cities (1 min)
- Click trip → "Add City"
- Select Paris, Barcelona, Rome
- Set dates and costs
- View itinerary

### 4. Share Experience (1 min)
- Click "Share Experience"
- Write about your trip
- Upload a photo (optional)
- Post to community

### 5. View Admin Stats (30 sec)
- Go to http://localhost:3000/admin.html
- View user count, trip count, posts
- Check trend charts
- See daily activity

---

## 📊 Sample Data

**Pre-loaded Cities (60 total):**
- Tokyo, Kyoto, Seoul, Bangkok, Singapore, Bali, Dubai, Istanbul
- Paris, Barcelona, Rome, London, Amsterdam, Berlin
- New York, Los Angeles, Mexico City, Rio de Janeiro, Sydney
- Plus 40+ more major cities

**Test Credentials:**
- Any email you register with
- Password must be 6+ characters

---

## ⚠️ Important Notes

### Before Demo
1. ✅ Ensure Node.js installed (`node --version`)
2. ✅ Run `npm install` first time
3. ✅ Run `npm run init-db` to seed cities
4. ✅ Start with `npm start` (not `npm run dev`)

### During Demo
- Wait 2-3 seconds for API responses (SQLite on localhost)
- If port 3000 busy, change in server.js line ~400
- Database persists across sessions (intentional for MVP)

### After Demo
- Data remains in traveloop.db (production-ready)
- Delete traveloop.db to reset everything
- Upload folder stores images from posts

---

## 🔐 Security Features Implemented

✅ Password hashing (bcrypt 10-round)
✅ SQL injection prevention (parameterized queries)
✅ XSS prevention (HTML sanitization)
✅ CORS enabled
✅ Session expiry (24 hours)
✅ File upload limits (5MB, max 5 files)
✅ Input validation (email, password strength)

---

## 📱 Browser Compatibility

✅ Chrome / Edge (recommended)
✅ Firefox
✅ Safari
✅ Mobile browsers (responsive design)

---

## 🎁 Bonus Features

- **Map Integration:** Leaflet maps with 60 city markers
- **Analytics Charts:** User trends & trip data visualization
- **File Uploads:** Multiple image support per post
- **Public Sharing:** Trip share tokens (not yet UI exposed)
- **User Logging:** Every action tracked for analytics
- **Admin Dashboard:** Real-time platform statistics

---

## 🆘 Troubleshooting

### "Cannot find module" error
```bash
npm install
```

### Port 3000 already in use
- Change PORT in .env file
- Or kill process: `taskkill /F /IM node.exe`

### Database errors
```bash
del traveloop.db
npm run init-db
npm start
```

### "Connection refused" on API calls
- Make sure server is running: `npm start`
- Check URL is http://localhost:3000 (not https)

### Images not uploading
- Check uploads/ folder exists
- Verify file is < 5MB
- Check browser console for errors

---

## 📞 Support

All features documented in README.md
Quick reference API docs above
Database schema in README

---

**Good luck with your hackathon! 🚀✈️🌍**
