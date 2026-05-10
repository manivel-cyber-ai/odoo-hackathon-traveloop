require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const bodyParser = require('body-parser');
const session = require('express-session');
const sqlite3 = require('sqlite3').verbose();
const uuid = require('uuid');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

app.use(session({
  secret: 'traveloop-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));

// Setup uploads directory
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Database setup
const db = new sqlite3.Database('traveloop.db', (err) => {
  if (err) console.error('Database connection error:', err);
  else console.log('Connected to SQLite database');
});

function runAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) return reject(err);
      resolve(this);
    });
  });
}

function getAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

async function ensureUsersRoleColumn() {
  return new Promise((resolve, reject) => {
    db.all(`PRAGMA table_info(users)`, async (err, cols) => {
      if (err) return reject(err);
      const hasIsAdmin = (cols || []).some(c => c.name === 'is_admin');
      if (hasIsAdmin) return resolve();

      try {
        await runAsync(`ALTER TABLE users ADD COLUMN is_admin INTEGER DEFAULT 0`);
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  });
}

function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  next();
}

function requireAdmin(req, res, next) {
  db.get(
    `SELECT is_admin FROM users WHERE id = ?`,
    [req.session.userId],
    (err, row) => {
      if (err || !row) return res.status(401).json({ error: 'Not authenticated' });
      if (!row.is_admin) return res.status(403).json({ error: 'Admin access required' });
      next();
    }
  );
}

// Initialize tables
const initDB = () => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT,
      phone TEXT,
      city TEXT,
      country TEXT,
      info TEXT,
      avatar TEXT,
      is_admin INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS trips (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      name TEXT,
      description TEXT,
      start_date TEXT,
      end_date TEXT,
      budget REAL,
      is_public BOOLEAN,
      share_token TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS stops (
      id TEXT PRIMARY KEY,
      trip_id TEXT,
      city_id TEXT,
      arrival_date TEXT,
      depart_date TEXT,
      transport_cost REAL,
      stay_cost REAL,
      order_num INTEGER,
      notes TEXT,
      FOREIGN KEY(trip_id) REFERENCES trips(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS activities (
      id TEXT PRIMARY KEY,
      stop_id TEXT,
      name TEXT,
      category TEXT,
      cost REAL,
      hours REAL,
      description TEXT,
      FOREIGN KEY(stop_id) REFERENCES stops(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS trip_posts (
      id TEXT PRIMARY KEY,
      trip_id TEXT,
      user_id TEXT,
      title TEXT,
      experience TEXT,
      images TEXT,
      likes INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(trip_id) REFERENCES trips(id),
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS cities (
      id TEXT PRIMARY KEY,
      name TEXT,
      country TEXT,
      region TEXT,
      latitude REAL,
      longitude REAL,
      cost_index REAL,
      popularity INTEGER,
      image TEXT,
      description TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS admin_logs (
      id TEXT PRIMARY KEY,
      event_type TEXT,
      user_id TEXT,
      data TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS user_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      action TEXT,
      details TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `);
};

initDB();
ensureUsersRoleColumn().catch((err) => {
  console.error('Failed to ensure users.is_admin column:', err.message);
});

// ==================== FALLBACK IMAGE ROUTE ====================
app.get('/api/image/placeholder/:city', (req, res) => {
  const city = decodeURIComponent(req.params.city);
  const colors = ['FF6B6B', '4ECDC4', '45B7D1', 'FFA07A', '98D8C8', 'F7DC6F', 'BB8FCE', '85C1E2', 'F8B88B', '82E0AA'];
  let hash = 0;
  for (let i = 0; i < city.length; i++) {
    hash = ((hash << 5) - hash) + city.charCodeAt(i);
    hash = hash & hash;
  }
  const color = colors[Math.abs(hash) % colors.length];
  const firstChar = city.charAt(0).toUpperCase();
  
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
      <rect fill="#${color}" width="800" height="600"/>
      <text x="50%" y="45%" font-size="100" fill="white" text-anchor="middle" font-weight="bold" font-family="Arial">${firstChar}</text>
      <text x="50%" y="60%" font-size="32" fill="rgba(255,255,255,0.9)" text-anchor="middle" font-family="Arial">${city}</text>
    </svg>
  `;
  
  res.set('Content-Type', 'image/svg+xml');
  res.set('Cache-Control', 'public, max-age=86400');
  res.send(svg);
});

// ==================== AUTH ENDPOINTS ====================
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, phone, city, country, info } = req.body;
  
  if (!email || !password || password.length < 6) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }

  const userId = 'u_' + uuid.v4().slice(0, 8);
  const hashedPassword = await bcrypt.hash(password, 10);

  db.run(
    `INSERT INTO users (id, name, email, password, phone, city, country, info, is_admin) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)`,
    [userId, sanitize(name), email, hashedPassword, phone, city, country, info],
    function(err) {
      if (err) return res.status(400).json({ error: 'Email already exists' });
      res.json({ success: true, userId, name });
    }
  );
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
    if (err || !user) return res.status(400).json({ error: 'Invalid credentials' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid credentials' });

    req.session.userId = user.id;
    logUserAction(user.id, 'LOGIN', 'User logged in');
    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: !!user.is_admin
      }
    });
  });
});

app.get('/api/auth/me', (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Not authenticated' });

  db.get(`SELECT id, name, email, phone, city, country, info, avatar, is_admin AS isAdmin FROM users WHERE id = ?`, 
    [req.session.userId], (err, user) => {
    if (err || !user) return res.status(400).json({ error: 'User not found' });
    res.json(user);
  });
});

app.post('/api/auth/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

// ==================== TRIP ENDPOINTS ====================
app.post('/api/trips', (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Not authenticated' });

  const { name, description, start_date, end_date, budget } = req.body;
  const tripId = 'trip_' + uuid.v4().slice(0, 8);

  db.run(
    `INSERT INTO trips (id, user_id, name, description, start_date, end_date, budget, is_public, share_token)
     VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?)`,
    [tripId, req.session.userId, sanitize(name), sanitize(description), start_date, end_date, budget, uuid.v4()],
    function(err) {
      if (err) return res.status(400).json({ error: err.message });
      logUserAction(req.session.userId, 'CREATE_TRIP', `Created trip: ${name}`);
      res.json({ success: true, tripId });
    }
  );
});

app.get('/api/trips', (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Not authenticated' });

  db.all(`SELECT * FROM trips WHERE user_id = ? ORDER BY updated_at DESC`, 
    [req.session.userId], (err, trips) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(trips || []);
  });
});

app.get('/api/trips/:tripId', (req, res) => {
  const { tripId } = req.params;
  
  db.get(`SELECT * FROM trips WHERE id = ?`, [tripId], (err, trip) => {
    if (err || !trip) return res.status(400).json({ error: 'Trip not found' });
    
    db.all(`SELECT * FROM stops WHERE trip_id = ? ORDER BY order_num`, 
      [tripId], (err, stops) => {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ ...trip, stops: stops || [] });
    });
  });
});

app.put('/api/trips/:tripId', (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Not authenticated' });

  const { tripId } = req.params;
  const { name, description, start_date, end_date, budget } = req.body;

  db.run(
    `UPDATE trips SET name = ?, description = ?, start_date = ?, end_date = ?, budget = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ? AND user_id = ?`,
    [sanitize(name), sanitize(description), start_date, end_date, budget, tripId, req.session.userId],
    function(err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

app.delete('/api/trips/:tripId', (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Not authenticated' });

  const { tripId } = req.params;

  db.run(`DELETE FROM trips WHERE id = ? AND user_id = ?`, 
    [tripId, req.session.userId], function(err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ success: true });
  });
});

// ==================== STOPS ENDPOINTS ====================
app.post('/api/stops', (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Not authenticated' });

  const { trip_id, city_id, arrival_date, depart_date, transport_cost, stay_cost, order_num } = req.body;
  const stopId = 'stop_' + uuid.v4().slice(0, 8);

  db.run(
    `INSERT INTO stops (id, trip_id, city_id, arrival_date, depart_date, transport_cost, stay_cost, order_num)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [stopId, trip_id, city_id, arrival_date, depart_date, transport_cost, stay_cost, order_num],
    function(err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ success: true, stopId });
    }
  );
});

app.put('/api/stops/:stopId', (req, res) => {
  const { stopId } = req.params;
  const { arrival_date, depart_date, transport_cost, stay_cost, notes } = req.body;

  db.run(
    `UPDATE stops SET arrival_date = ?, depart_date = ?, transport_cost = ?, stay_cost = ?, notes = ?
     WHERE id = ?`,
    [arrival_date, depart_date, transport_cost, stay_cost, notes, stopId],
    function(err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

app.delete('/api/stops/:stopId', (req, res) => {
  const { stopId } = req.params;

  db.run(`DELETE FROM stops WHERE id = ?`, [stopId], function(err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ success: true });
  });
});

// ==================== CITIES ENDPOINTS ====================
app.get('/api/cities', (req, res) => {
  db.all(`SELECT * FROM cities`, (err, cities) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(cities || []);
  });
});

app.get('/api/cities/:cityId', (req, res) => {
  const { cityId } = req.params;

  db.get(`SELECT * FROM cities WHERE id = ?`, [cityId], (err, city) => {
    if (err || !city) return res.status(400).json({ error: 'City not found' });
    res.json(city);
  });
});

// ==================== COMMUNITY / POSTS ====================
app.post('/api/posts', upload.array('images', 5), (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Not authenticated' });

  const { trip_id, title, experience } = req.body;
  const postId = 'post_' + uuid.v4().slice(0, 8);
  const images = req.files ? req.files.map(f => f.path).join(',') : '';

  db.run(
    `INSERT INTO trip_posts (id, trip_id, user_id, title, experience, images)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [postId, trip_id, req.session.userId, sanitize(title), sanitize(experience), images],
    function(err) {
      if (err) return res.status(400).json({ error: err.message });
      logUserAction(req.session.userId, 'CREATE_POST', `Created post: ${title}`);
      res.json({ success: true, postId });
    }
  );
});

app.get('/api/posts', (req, res) => {
  db.all(
    `SELECT p.*, u.name, u.avatar, MIN(c.name) as city_name FROM trip_posts p
     LEFT JOIN users u ON p.user_id = u.id
     LEFT JOIN trips t ON p.trip_id = t.id
     LEFT JOIN stops s ON t.id = s.trip_id
     LEFT JOIN cities c ON s.city_id = c.id
     GROUP BY p.id
     ORDER BY p.created_at DESC LIMIT 50`,
    (err, posts) => {
      if (err) return res.status(400).json({ error: err.message });
      res.json(posts || []);
    }
  );
});

app.get('/api/posts/trip/:tripId', (req, res) => {
  const { tripId } = req.params;

  db.all(
    `SELECT * FROM trip_posts WHERE trip_id = ? ORDER BY created_at DESC`,
    [tripId],
    (err, posts) => {
      if (err) return res.status(400).json({ error: err.message });
      res.json(posts || []);
    }
  );
});

app.post('/api/posts/:postId/like', (req, res) => {
  const { postId } = req.params;

  db.run(
    `UPDATE trip_posts SET likes = likes + 1 WHERE id = ?`,
    [postId],
    function(err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

// ==================== ADMIN / ANALYTICS ====================
app.get('/api/admin/stats', (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Not authenticated' });

  db.get(`SELECT is_admin FROM users WHERE id = ?`, [req.session.userId], (authErr, authRow) => {
    if (authErr || !authRow) return res.status(401).json({ error: 'Not authenticated' });
    if (!authRow.is_admin) return res.status(403).json({ error: 'Admin access required' });

    const stats = {};

    db.get(`SELECT COUNT(*) as total FROM users`, (err, result) => {
      stats.totalUsers = result.total;

      db.get(`SELECT COUNT(*) as total FROM trips`, (err, result) => {
        stats.totalTrips = result.total;

        db.get(`SELECT COUNT(*) as total FROM trip_posts`, (err, result) => {
          stats.totalPosts = result.total;

          db.all(
            `SELECT COUNT(*) as count, DATE(created_at) as date FROM user_logs GROUP BY DATE(created_at)`,
            (err, logs) => {
              stats.userActivity = logs || [];
              res.json(stats);
            }
          );
        });
      });
    });
  });
});

app.get('/api/admin/user-trends', requireAuth, requireAdmin, (req, res) => {
  db.all(
    `SELECT DATE(created_at) as date, COUNT(*) as new_users FROM users GROUP BY DATE(created_at)`,
    (err, trends) => {
      if (err) return res.status(400).json({ error: err.message });
      res.json(trends || []);
    }
  );
});

app.get('/api/admin/trip-data', requireAuth, requireAdmin, (req, res) => {
  db.all(
    `SELECT 
      DATE(created_at) as date,
      COUNT(*) as trips_created,
      AVG(budget) as avg_budget,
      MAX(budget) as max_budget
     FROM trips GROUP BY DATE(created_at)`,
    (err, data) => {
      if (err) return res.status(400).json({ error: err.message });
      res.json(data || []);
    }
  );
});

// ==================== UTILITY FUNCTIONS ====================
function sanitize(str) {
  if (!str) return '';
  return String(str)
    .replace(/[&<>"'\/]/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;',
      '"': '&quot;', "'": '&#039;', '/': '&#x2F;'
    }[c]));
}

function logUserAction(userId, action, details) {
  const logId = 'log_' + uuid.v4().slice(0, 8);
  db.run(
    `INSERT INTO user_logs (id, user_id, action, details) VALUES (?, ?, ?, ?)`,
    [logId, userId, action, sanitize(details)]
  );
}

// ==================== STARTUP ====================
app.listen(PORT, () => {
  console.log(`🚀 Traveloop API running on http://localhost:${PORT}`);
  console.log('📊 Admin dashboard at http://localhost:3000/admin');
  console.log('📱 Frontend at http://localhost:3000');
});
