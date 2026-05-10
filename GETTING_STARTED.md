# Traveloop – Getting Started Guide

**Get your travel planning app running in 5 minutes!**

---

## 🚀 Quick Setup

### Step 1: Install Dependencies (1 min)

```bash
cd d:\traveloop
npm install
```

This downloads all required packages (Express, SQLite, bcryptjs, etc.)

---

### Step 2: Initialize Database (1 min)

```bash
npm run init-db
```

This command:
- ✅ Creates `traveloop.db` SQLite database
- ✅ Creates 8 tables (users, cities, trips, posts, etc.)
- ✅ Loads 378 cities across 5 regions
- ✅ Seeds 7 demo user accounts
- ✅ Creates 15+ sample community posts

**Output:**
```
✅ Connected to database - seeding data...
✅ Seeded cities: 378
✅ Seeded users: 7
✅ Seeded community posts: 18
```

---

### Step 3: Start Server (1 min)

```bash
npm start
```

Server runs at: **http://localhost:3001**

**Output:**
```
> traveloop-hackathon@1.0.0 start
> node server.js

✅ Database connected
✅ Server listening on port 3001
✅ Ready to go! http://localhost:3001
```

---

### Step 4: Open in Browser (1 min)

1. Open your browser
2. Go to: **http://localhost:3001**
3. You should see the Traveloop home page

---

## 🔐 Test Accounts

### Admin Account (Full Access)
```
Email:    admin@traveloop.io
Password: Admin@12345
```

**Can do:**
- Access admin dashboard
- View platform statistics
- See all users and trips
- Manage system logs

---

### Demo Accounts (User Access)
```
Email:    ava@traveloop.io
Password: Demo@12345
```

Other demo accounts:
- noah@traveloop.io / Demo@12345
- mia@traveloop.io / Demo@12345
- lucas@traveloop.io / Demo@12345
- emma@traveloop.io / Demo@12345

**Can do:**
- Browse cities
- Create and manage trips
- Post on community
- View profile and preferences

---

## 🎯 Key Features to Try

### 1. Browse Cities (🌍 menu)
- View 378 cities from around the world
- See each city's daily cost & popularity
- Click city card to view full profile
- Interactive map with all cities
- Search by city name

**Try:** Click on "Tokyo" to see city details

---

### 2. Create a Trip (✈️ menu)
- Click "New Trip"
- Enter trip title, description, budget
- Add cities to your itinerary
- View automatic budget calculations
- Save and edit your trip

**Try:** Create a trip called "Asia Adventure"

---

### 3. Community Posts (💬 menu)
- Read travel experiences from others
- Like posts you find helpful
- Create your own post
- Share travel tips and photos

**Try:** Create a new post about your favorite city

---

### 4. User Profile (👤 menu)
- View your account information
- Update your profile
- See your trip history
- Check account status

**Try:** Update your profile picture or bio

---

### 5. Admin Dashboard (Admin only)
- View platform statistics
- See total users, trips, posts
- Check platform trends
- View admin logs

**Try:** Login as admin@traveloop.io to see stats

---

## 🗺️ City Map Features

**Interactive Leaflet Map:**
- 🔍 Zoom in/out to explore regions
- 🔴 Click city markers to see details
- 🖱️ Drag to pan around the world
- 📍 See GPS coordinates for each city

**Try:** Find a city you want to visit and click the marker

---

## 💾 Database

The app includes **pre-loaded data** to demo immediately:

| Item | Count |
|------|-------|
| **Global Cities** | 378 |
| **Demo Users** | 7 |
| **Sample Trips** | 5 |
| **Community Posts** | 18 |
| **Database Size** | ~500 KB |

**Cities by Region:**
- 🏯 Asia: 80 cities
- 🏰 Europe: 90 cities
- 🗽 Americas: 90 cities
- 🦁 Africa: 70 cities
- 🏖️ Oceania: 40 cities

---

## 📱 Responsive Design

Works perfectly on:
- ✅ Desktop (1920px and larger)
- ✅ Tablet (768px - 1024px)
- ✅ Mobile (320px - 767px)

Try resizing your browser to see responsive layout

---

## 🔌 API Endpoints (Reference)

### User Routes
```
POST   /api/auth/register         Create account
POST   /api/auth/login            Sign in
GET    /api/auth/me               Current user
POST   /api/auth/logout           Sign out
```

### Trip Routes
```
GET    /api/trips                 Your trips
POST   /api/trips                 New trip
GET    /api/trips/:id             Trip details
PUT    /api/trips/:id             Update trip
DELETE /api/trips/:id             Delete trip
```

### City Routes
```
GET    /api/cities                All cities
GET    /api/cities/:id            City info
```

### Community Routes
```
GET    /api/posts                 All posts
POST   /api/posts                 New post
POST   /api/posts/:id/like        Like post
```

### Admin Routes
```
GET    /api/admin/stats           Statistics (admin only)
```

---

## 🛠️ Troubleshooting

### Port 3001 Already in Use
```bash
# Kill existing process on port 3001
# Windows:
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3001 | xargs kill -9
```

### Database Error
```bash
# Delete old database and reseed
rm traveloop.db
npm run init-db
```

### Dependency Issues
```bash
# Clear cache and reinstall
rm -r node_modules
rm package-lock.json
npm install
npm start
```

### Can't Connect to Server
- Check port 3001 is available
- Verify `npm start` completed successfully
- Check browser URL: `http://localhost:3001` (not https)
- Try `http://127.0.0.1:3001` instead

---

## 📚 Detailed Documentation

For more information, see:
- **[README.md](README.md)** – Complete project documentation
- **[Architecture](#)** – System design and database schema
- **[API Docs](#)** – Full endpoint reference
- **[Deployment](#)** – How to deploy to production

---

## 🎬 Demo Walkthrough

### 5-Minute Demo Script

```
1. Show home page (2 min)
   - Explain platform features
   - Show quick stats

2. Browse cities (1 min)
   - Scroll city grid
   - Click interactive map
   - Show city details

3. Create a trip (1 min)
   - Add a trip with 3 cities
   - Show budget calculation
   - Save trip

4. Show admin (1 min)
   - Login as admin
   - View dashboard stats
   - Show platform analytics
```

---

## 🎯 What's Next?

### To Customize:

1. **Add more cities:**
   - Edit `scripts/init-db.js`
   - Add to `citySeed` array

2. **Change styling:**
   - Edit CSS in `public/index.html`
   - Modify colors, fonts, layout

3. **Add new features:**
   - Add routes in `server.js`
   - Create new endpoints
   - Update frontend

4. **Connect real data:**
   - Replace city images
   - Add real hotel/flight APIs
   - Integrate payment system

---

## 🚀 Deploy to Production

### Heroku (Easiest)
```bash
heroku create your-app-name
heroku config:set SESSION_SECRET=your-secret
git push heroku main
```

### Render or Railway
See [README.md](README.md) deployment section

---

## 💬 Support

- **Questions?** Check README.md for detailed docs
- **Errors?** Check browser console (F12)
- **Bug?** Check server logs in terminal
- **Features?** Edit code in `public/index.html` and `server.js`

---

**Ready to explore? Open http://localhost:3001 now! 🌍✈️**
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
