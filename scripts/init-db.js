const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const db = new sqlite3.Database('traveloop.db', (err) => {
  if (err) console.error('❌ Connection error:', err);
  else console.log('✅ Connected to database - seeding data...');
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

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function hashCode(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = ((hash << 5) - hash) + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function regionDefaults(region) {
  const map = {
    Asia: { latBase: 20, lonBase: 95, costMin: 4.5, costMax: 9.0 },
    Europe: { latBase: 49, lonBase: 12, costMin: 6.0, costMax: 9.5 },
    Americas: { latBase: 15, lonBase: -75, costMin: 5.0, costMax: 9.2 },
    Africa: { latBase: 5, lonBase: 20, costMin: 3.5, costMax: 7.5 },
    Oceania: { latBase: -22, lonBase: 145, costMin: 6.5, costMax: 9.0 }
  };
  return map[region] || map.Asia;
}

// Generate colored placeholder SVG for all cities (namecard style)
// Each city gets a unique color based on its name
function generateColoredPlaceholder(cityName) {
  const colors = ['FF6B6B', '4ECDC4', '45B7D1', 'FFA07A', '98D8C8', 'F7DC6F', 'BB8FCE', '85C1E2', 'F8B88B', '82E0AA'];
  let hash = 0;
  for (let i = 0; i < cityName.length; i++) {
    hash = ((hash << 5) - hash) + cityName.charCodeAt(i);
    hash = hash & hash;
  }
  const color = colors[Math.abs(hash) % colors.length];
  const firstChar = cityName.charAt(0).toUpperCase();
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect fill='%23${color}' width='800' height='600'/%3E%3Ctext x='50%25' y='45%25' font-size='100' fill='white' text-anchor='middle' font-weight='bold' font-family='Arial'%3E${firstChar}%3C/text%3E%3Ctext x='50%25' y='60%25' font-size='32' fill='rgba(255,255,255,0.9)' text-anchor='middle' font-family='Arial'%3E${cityName}%3C/text%3E%3C/svg%3E`;
}

function getCityImage(name) {
  // Use colorful SVG placeholders for all cities
  return generateColoredPlaceholder(name);
}

function cityImageUrl(name) {
  const query = encodeURIComponent(`${name} skyline travel city`);
  return `https://source.unsplash.com/1200x800/?${query}`;
}

function makeCityDetails(city) {
  const seed = hashCode(`${city.name}-${city.country}`);
  const defaults = regionDefaults(city.region);

  const lat = Number((defaults.latBase + ((seed % 2200) / 100) - 11).toFixed(4));
  const lon = Number((defaults.lonBase + (((seed / 7) % 3000) / 100) - 15).toFixed(4));
  const costSpread = defaults.costMax - defaults.costMin;
  const cost = Number((defaults.costMin + ((seed % 100) / 100) * costSpread).toFixed(1));
  const pop = 65 + (seed % 36);

  return {
    ...city,
    latitude: lat,
    longitude: lon,
    costIndex: cost,
    popularity: pop,
    image: getCityImage(city.name),
    description: `${city.name} is a vibrant destination in ${city.country}. Discover amazing local food, stunning architecture, and unique experiences.`
  };
}

const citySeed = [
  // Asia - 80 cities
  ['Tokyo', 'Japan', 'Asia'], ['Osaka', 'Japan', 'Asia'], ['Kyoto', 'Japan', 'Asia'], ['Sapporo', 'Japan', 'Asia'],
  ['Nagoya', 'Japan', 'Asia'], ['Fukuoka', 'Japan', 'Asia'], ['Yokohama', 'Japan', 'Asia'], ['Hiroshima', 'Japan', 'Asia'],
  ['Seoul', 'South Korea', 'Asia'], ['Busan', 'South Korea', 'Asia'], ['Incheon', 'South Korea', 'Asia'], ['Daegu', 'South Korea', 'Asia'],
  ['Daejeon', 'South Korea', 'Asia'], ['Ulsan', 'South Korea', 'Asia'], ['Gwangju', 'South Korea', 'Asia'], ['Jeju', 'South Korea', 'Asia'],
  ['Beijing', 'China', 'Asia'], ['Shanghai', 'China', 'Asia'], ['Shenzhen', 'China', 'Asia'], ['Guangzhou', 'China', 'Asia'],
  ['Chengdu', 'China', 'Asia'], ['Xi an', 'China', 'Asia'], ['Hangzhou', 'China', 'Asia'], ['Nanjing', 'China', 'Asia'],
  ['Wuhan', 'China', 'Asia'], ['Chongqing', 'China', 'Asia'], ['Suzhou', 'China', 'Asia'], ['Harbin', 'China', 'Asia'],
  ['Taipei', 'Taiwan', 'Asia'], ['Kaohsiung', 'Taiwan', 'Asia'], ['Taichung', 'Taiwan', 'Asia'], ['Tainan', 'Taiwan', 'Asia'],
  ['Bangkok', 'Thailand', 'Asia'], ['Chiang Mai', 'Thailand', 'Asia'], ['Phuket', 'Thailand', 'Asia'], ['Pattaya', 'Thailand', 'Asia'],
  ['Singapore', 'Singapore', 'Asia'], ['Kuala Lumpur', 'Malaysia', 'Asia'], ['George Town', 'Malaysia', 'Asia'], ['Johor Bahru', 'Malaysia', 'Asia'],
  ['Jakarta', 'Indonesia', 'Asia'], ['Bali', 'Indonesia', 'Asia'], ['Bandung', 'Indonesia', 'Asia'], ['Surabaya', 'Indonesia', 'Asia'],
  ['Medan', 'Indonesia', 'Asia'], ['Semarang', 'Indonesia', 'Asia'], ['Ho Chi Minh City', 'Vietnam', 'Asia'], ['Hanoi', 'Vietnam', 'Asia'],
  ['Da Nang', 'Vietnam', 'Asia'], ['Nha Trang', 'Vietnam', 'Asia'], ['Hue', 'Vietnam', 'Asia'], ['Can Tho', 'Vietnam', 'Asia'],
  ['Manila', 'Philippines', 'Asia'], ['Cebu', 'Philippines', 'Asia'], ['Davao', 'Philippines', 'Asia'], ['Baguio', 'Philippines', 'Asia'],
  ['Dubai', 'UAE', 'Asia'], ['Abu Dhabi', 'UAE', 'Asia'], ['Sharjah', 'UAE', 'Asia'], ['Doha', 'Qatar', 'Asia'],
  ['Riyadh', 'Saudi Arabia', 'Asia'], ['Jeddah', 'Saudi Arabia', 'Asia'], ['Muscat', 'Oman', 'Asia'], ['Kuwait City', 'Kuwait', 'Asia'],
  ['Istanbul', 'Turkey', 'Asia'], ['Ankara', 'Turkey', 'Asia'], ['Izmir', 'Turkey', 'Asia'], ['Antalya', 'Turkey', 'Asia'],
  ['Mumbai', 'India', 'Asia'], ['Delhi', 'India', 'Asia'], ['Bengaluru', 'India', 'Asia'], ['Chennai', 'India', 'Asia'],
  
  // Europe - 90 cities
  ['London', 'United Kingdom', 'Europe'], ['Manchester', 'United Kingdom', 'Europe'], ['Edinburgh', 'United Kingdom', 'Europe'], ['Bristol', 'United Kingdom', 'Europe'],
  ['Liverpool', 'United Kingdom', 'Europe'], ['York', 'United Kingdom', 'Europe'], ['Cambridge', 'United Kingdom', 'Europe'], ['Oxford', 'United Kingdom', 'Europe'],
  ['Paris', 'France', 'Europe'], ['Lyon', 'France', 'Europe'], ['Marseille', 'France', 'Europe'], ['Nice', 'France', 'Europe'],
  ['Toulouse', 'France', 'Europe'], ['Strasbourg', 'France', 'Europe'], ['Bordeaux', 'France', 'Europe'], ['Lille', 'France', 'Europe'],
  ['Barcelona', 'Spain', 'Europe'], ['Madrid', 'Spain', 'Europe'], ['Valencia', 'Spain', 'Europe'], ['Seville', 'Spain', 'Europe'],
  ['Granada', 'Spain', 'Europe'], ['Cordoba', 'Spain', 'Europe'], ['Bilbao', 'Spain', 'Europe'], ['Malaga', 'Spain', 'Europe'],
  ['Palma', 'Spain', 'Europe'], ['San Sebastian', 'Spain', 'Europe'], ['Rome', 'Italy', 'Europe'], ['Milan', 'Italy', 'Europe'],
  ['Florence', 'Italy', 'Europe'], ['Naples', 'Italy', 'Europe'], ['Venice', 'Italy', 'Europe'], ['Verona', 'Italy', 'Europe'],
  ['Bologna', 'Italy', 'Europe'], ['Turin', 'Italy', 'Europe'], ['Genoa', 'Italy', 'Europe'], ['Palermo', 'Italy', 'Europe'],
  ['Berlin', 'Germany', 'Europe'], ['Munich', 'Germany', 'Europe'], ['Hamburg', 'Germany', 'Europe'], ['Frankfurt', 'Germany', 'Europe'],
  ['Cologne', 'Germany', 'Europe'], ['Dusseldorf', 'Germany', 'Europe'], ['Stuttgart', 'Germany', 'Europe'], ['Heidelberg', 'Germany', 'Europe'],
  ['Dresden', 'Germany', 'Europe'], ['Nuremberg', 'Germany', 'Europe'], ['Amsterdam', 'Netherlands', 'Europe'], ['Rotterdam', 'Netherlands', 'Europe'],
  ['The Hague', 'Netherlands', 'Europe'], ['Utrecht', 'Netherlands', 'Europe'], ['Groningen', 'Netherlands', 'Europe'], ['Brussels', 'Belgium', 'Europe'],
  ['Antwerp', 'Belgium', 'Europe'], ['Ghent', 'Belgium', 'Europe'], ['Bruges', 'Belgium', 'Europe'], ['Liege', 'Belgium', 'Europe'],
  ['Zurich', 'Switzerland', 'Europe'], ['Geneva', 'Switzerland', 'Europe'], ['Basel', 'Switzerland', 'Europe'], ['Bern', 'Switzerland', 'Europe'],
  ['Lausanne', 'Switzerland', 'Europe'], ['Vienna', 'Austria', 'Europe'], ['Salzburg', 'Austria', 'Europe'], ['Graz', 'Austria', 'Europe'],
  ['Innsbruck', 'Austria', 'Europe'], ['Linz', 'Austria', 'Europe'], ['Prague', 'Czechia', 'Europe'], ['Brno', 'Czechia', 'Europe'],
  ['Ostrava', 'Czechia', 'Europe'], ['Budapest', 'Hungary', 'Europe'], ['Debrecen', 'Hungary', 'Europe'], ['Stockholm', 'Sweden', 'Europe'],
  ['Gothenburg', 'Sweden', 'Europe'], ['Malmo', 'Sweden', 'Europe'], ['Oslo', 'Norway', 'Europe'], ['Bergen', 'Norway', 'Europe'],
  ['Copenhagen', 'Denmark', 'Europe'], ['Helsinki', 'Finland', 'Europe'], ['Warsaw', 'Poland', 'Europe'], ['Krakow', 'Poland', 'Europe'],
  
  // Americas - 90 cities
  ['New York', 'USA', 'Americas'], ['Los Angeles', 'USA', 'Americas'], ['Chicago', 'USA', 'Americas'], ['San Francisco', 'USA', 'Americas'],
  ['Miami', 'USA', 'Americas'], ['Seattle', 'USA', 'Americas'], ['Boston', 'USA', 'Americas'], ['Houston', 'USA', 'Americas'],
  ['Denver', 'USA', 'Americas'], ['Phoenix', 'USA', 'Americas'], ['Austin', 'USA', 'Americas'], ['Nashville', 'USA', 'Americas'],
  ['New Orleans', 'USA', 'Americas'], ['San Diego', 'USA', 'Americas'], ['Las Vegas', 'USA', 'Americas'], ['Orlando', 'USA', 'Americas'],
  ['Portland', 'USA', 'Americas'], ['Minneapolis', 'USA', 'Americas'], ['Atlanta', 'USA', 'Americas'], ['Dallas', 'USA', 'Americas'],
  ['Philadelphia', 'USA', 'Americas'], ['Washington', 'USA', 'Americas'], ['Honolulu', 'USA', 'Americas'], ['Anchorage', 'USA', 'Americas'],
  ['Toronto', 'Canada', 'Americas'], ['Vancouver', 'Canada', 'Americas'], ['Montreal', 'Canada', 'Americas'], ['Calgary', 'Canada', 'Americas'],
  ['Ottawa', 'Canada', 'Americas'], ['Quebec City', 'Canada', 'Americas'], ['Mexico City', 'Mexico', 'Americas'], ['Guadalajara', 'Mexico', 'Americas'],
  ['Monterrey', 'Mexico', 'Americas'], ['Cancun', 'Mexico', 'Americas'], ['Puerto Vallarta', 'Mexico', 'Americas'], ['Playa del Carmen', 'Mexico', 'Americas'],
  ['Rio de Janeiro', 'Brazil', 'Americas'], ['Sao Paulo', 'Brazil', 'Americas'], ['Salvador', 'Brazil', 'Americas'], ['Brasilia', 'Brazil', 'Americas'],
  ['Recife', 'Brazil', 'Americas'], ['Manaus', 'Brazil', 'Americas'], ['Florianopolis', 'Brazil', 'Americas'], ['Buenos Aires', 'Argentina', 'Americas'],
  ['Cordoba', 'Argentina', 'Americas'], ['Mendoza', 'Argentina', 'Americas'], ['Santiago', 'Chile', 'Americas'], ['Valparaiso', 'Chile', 'Americas'],
  ['Concepcion', 'Chile', 'Americas'], ['Pucon', 'Chile', 'Americas'], ['Lima', 'Peru', 'Americas'], ['Cusco', 'Peru', 'Americas'],
  ['Arequipa', 'Peru', 'Americas'], ['Trujillo', 'Peru', 'Americas'], ['Bogota', 'Colombia', 'Americas'], ['Medellin', 'Colombia', 'Americas'],
  ['Cartagena', 'Colombia', 'Americas'], ['Cali', 'Colombia', 'Americas'], ['Quito', 'Ecuador', 'Americas'], ['Guayaquil', 'Ecuador', 'Americas'],
  ['La Paz', 'Bolivia', 'Americas'], ['Montevideo', 'Uruguay', 'Americas'], ['Punta del Este', 'Uruguay', 'Americas'], ['San Jose', 'Costa Rica', 'Americas'],
  ['Panama City', 'Panama', 'Americas'], ['Havana', 'Cuba', 'Americas'], ['Dominican Republic', 'Dominican Republic', 'Americas'], ['San Juan', 'Puerto Rico', 'Americas'],
  
  // Africa - 70 cities  
  ['Cairo', 'Egypt', 'Africa'], ['Alexandria', 'Egypt', 'Africa'], ['Giza', 'Egypt', 'Africa'], ['Luxor', 'Egypt', 'Africa'],
  ['Aswan', 'Egypt', 'Africa'], ['Casablanca', 'Morocco', 'Africa'], ['Marrakesh', 'Morocco', 'Africa'], ['Fez', 'Morocco', 'Africa'],
  ['Tangier', 'Morocco', 'Africa'], ['Agadir', 'Morocco', 'Africa'], ['Tunis', 'Tunisia', 'Africa'], ['Sousse', 'Tunisia', 'Africa'],
  ['Djerba', 'Tunisia', 'Africa'], ['Lagos', 'Nigeria', 'Africa'], ['Abuja', 'Nigeria', 'Africa'], ['Kano', 'Nigeria', 'Africa'],
  ['Accra', 'Ghana', 'Africa'], ['Kumasi', 'Ghana', 'Africa'], ['Nairobi', 'Kenya', 'Africa'], ['Mombasa', 'Kenya', 'Africa'],
  ['Kisumu', 'Kenya', 'Africa'], ['Nakuru', 'Kenya', 'Africa'], ['Addis Ababa', 'Ethiopia', 'Africa'], ['Dire Dawa', 'Ethiopia', 'Africa'],
  ['Kampala', 'Uganda', 'Africa'], ['Entebbe', 'Uganda', 'Africa'], ['Jinja', 'Uganda', 'Africa'], ['Kigali', 'Rwanda', 'Africa'],
  ['Dar es Salaam', 'Tanzania', 'Africa'], ['Zanzibar', 'Tanzania', 'Africa'], ['Arusha', 'Tanzania', 'Africa'], ['Johannesburg', 'South Africa', 'Africa'],
  ['Cape Town', 'South Africa', 'Africa'], ['Durban', 'South Africa', 'Africa'], ['Pretoria', 'South Africa', 'Africa'], ['Port Elizabeth', 'South Africa', 'Africa'],
  ['Bloemfontein', 'South Africa', 'Africa'], ['Windhoek', 'Namibia', 'Africa'], ['Swakopmund', 'Namibia', 'Africa'], ['Gaborone', 'Botswana', 'Africa'],
  ['Luanda', 'Angola', 'Africa'], ['Kinshasa', 'Congo', 'Africa'], ['Brazzaville', 'Congo', 'Africa'], ['Yaounde', 'Cameroon', 'Africa'],
  ['Douala', 'Cameroon', 'Africa'], ['Dakar', 'Senegal', 'Africa'], ['Bamako', 'Mali', 'Africa'], ['Ouagadougou', 'Burkina Faso', 'Africa'],
  ['Niamey', 'Niger', 'Africa'], ['Antananarivo', 'Madagascar', 'Africa'], ['Port Louis', 'Mauritius', 'Africa'], ['Victoria', 'Seychelles', 'Africa'],
  ['Algiers', 'Algeria', 'Africa'], ['Oran', 'Algeria', 'Africa'], ['Tripoli', 'Libya', 'Africa'], ['Khartoum', 'Sudan', 'Africa'],
  
  // Oceania - 40 cities
  ['Sydney', 'Australia', 'Oceania'], ['Melbourne', 'Australia', 'Oceania'], ['Brisbane', 'Australia', 'Oceania'], ['Perth', 'Australia', 'Oceania'],
  ['Adelaide', 'Australia', 'Oceania'], ['Canberra', 'Australia', 'Oceania'], ['Hobart', 'Australia', 'Oceania'], ['Darwin', 'Australia', 'Oceania'],
  ['Gold Coast', 'Australia', 'Oceania'], ['Cairns', 'Australia', 'Oceania'], ['Newcastle', 'Australia', 'Oceania'], ['Wollongong', 'Australia', 'Oceania'],
  ['Auckland', 'New Zealand', 'Oceania'], ['Wellington', 'New Zealand', 'Oceania'], ['Christchurch', 'New Zealand', 'Oceania'], ['Queenstown', 'New Zealand', 'Oceania'],
  ['Hamilton', 'New Zealand', 'Oceania'], ['Tauranga', 'New Zealand', 'Oceania'], ['Rotorua', 'New Zealand', 'Oceania'], ['Dunedin', 'New Zealand', 'Oceania'],
  ['Suva', 'Fiji', 'Oceania'], ['Nadi', 'Fiji', 'Oceania'], ['Lautoka', 'Fiji', 'Oceania'], ['Port Moresby', 'Papua New Guinea', 'Oceania'],
  ['Honiara', 'Solomon Islands', 'Oceania'], ['Apia', 'Samoa', 'Oceania'], ['Nukualofa', 'Tonga', 'Oceania'], ['Port Vila', 'Vanuatu', 'Oceania'],
  ['Koror', 'Palau', 'Oceania'], ['Majuro', 'Marshall Islands', 'Oceania'], ['Saipan', 'Northern Mariana Islands', 'Oceania'], ['Hagatna', 'Guam', 'Oceania'],
  ['Papeete', 'French Polynesia', 'Oceania'], ['Noumea', 'New Caledonia', 'Oceania'], ['Kiritimati', 'Kiribati', 'Oceania'], ['Nuku alofa', 'Tonga', 'Oceania'],
  ['Tarawa', 'Kiribati', 'Oceania'], ['Funafuti', 'Tuvalu', 'Oceania'], ['Raiatea', 'French Polynesia', 'Oceania'], ['Bora Bora', 'French Polynesia', 'Oceania']
].map(([name, country, region]) => ({ name, country, region }));

async function ensureUsersRoleColumn() {
  const columns = await new Promise((resolve, reject) => {
    db.all(`PRAGMA table_info(users)`, (err, rows) => {
      if (err) return reject(err);
      resolve(rows || []);
    });
  });

  const hasIsAdmin = columns.some(c => c.name === 'is_admin');
  if (!hasIsAdmin) {
    await runAsync(`ALTER TABLE users ADD COLUMN is_admin INTEGER DEFAULT 0`);
  }
}

async function ensureTables() {
  await runAsync(`
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

  await runAsync(`
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

  await runAsync(`
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

  await runAsync(`
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

  await runAsync(`
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
}

async function seedCities() {
  for (const city of citySeed.map(makeCityDetails)) {
    const cityId = `c_${slugify(`${city.name}-${city.country}`)}`;
    await runAsync(
      `INSERT OR IGNORE INTO cities (id, name, country, region, latitude, longitude, cost_index, popularity, image, description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        cityId,
        city.name,
        city.country,
        city.region,
        city.latitude,
        city.longitude,
        city.costIndex,
        city.popularity,
        city.image,
        city.description
      ]
    );

    await runAsync(
      `UPDATE cities
       SET latitude = ?, longitude = ?, cost_index = ?, popularity = ?, image = ?, description = ?, region = ?
       WHERE id = ?`,
      [
        city.latitude,
        city.longitude,
        city.costIndex,
        city.popularity,
        city.image,
        city.description,
        city.region,
        cityId
      ]
    );
  }
}

async function seedUsersTripsAndPosts() {
  const adminEmail = 'admin@traveloop.io';
  const adminPassword = await bcrypt.hash('Admin@12345', 10);

  await runAsync(
    `INSERT OR IGNORE INTO users (id, name, email, password, city, country, info, is_admin)
     VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
    ['u_admin', 'Admin Panel', adminEmail, adminPassword, 'Singapore', 'Singapore', 'Platform administrator']
  );

  await runAsync(`UPDATE users SET is_admin = 1 WHERE email = ?`, [adminEmail]);

  const demoUsers = [
    ['u_demo_1', 'Ava Wander', 'ava@traveloop.io', 'Tokyo', 'Japan'],
    ['u_demo_2', 'Noah Miles', 'noah@traveloop.io', 'Barcelona', 'Spain'],
    ['u_demo_3', 'Mia Globe', 'mia@traveloop.io', 'New York', 'USA'],
    ['u_demo_4', 'Lucas Travel', 'lucas@traveloop.io', 'Paris', 'France'],
    ['u_demo_5', 'Emma Explorer', 'emma@traveloop.io', 'Sydney', 'Australia']
  ];

  for (const [id, name, email, city, country] of demoUsers) {
    const pwd = await bcrypt.hash('Demo@12345', 10);
    await runAsync(
      `INSERT OR IGNORE INTO users (id, name, email, password, city, country, info, is_admin)
       VALUES (?, ?, ?, ?, ?, ?, ?, 0)`,
      [id, name, email, pwd, city, country, 'Seeded traveler account']
    );
  }

  const demoTrips = [
    ['trip_1', 'u_demo_1', 'Japan Summer Journey', 'Historic temples and modern cities', '2026-06-04', '2026-06-18', 2800],
    ['trip_2', 'u_demo_2', 'European Culture Trail', 'Art, architecture, and local cuisine', '2026-07-01', '2026-07-16', 3500],
    ['trip_3', 'u_demo_3', 'US East Coast Adventure', 'Beach, city, and mountain experiences', '2026-08-08', '2026-08-22', 3200],
    ['trip_4', 'u_demo_4', 'Mediterranean Escape', 'Sun, sea, and cultural heritage', '2026-09-01', '2026-09-14', 2900],
    ['trip_5', 'u_demo_5', 'Asian Exploration', 'From deserts to tropical islands', '2026-10-01', '2026-10-20', 3100]
  ];

  for (const [id, userId, name, desc, start, end, budget] of demoTrips) {
    await runAsync(
      `INSERT OR IGNORE INTO trips (id, user_id, name, description, start_date, end_date, budget, is_public, share_token)
       VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?)`,
      [id, userId, name, desc, start, end, budget, `share_${id}`]
    );
  }

  // Create stops
  const stops = [
    ['stop_1', 'trip_1', 'c_tokyo-japan', '2026-06-04', '2026-06-08', 120, 680, 1],
    ['stop_2', 'trip_2', 'c_barcelona-spain', '2026-07-01', '2026-07-05', 100, 720, 1],
    ['stop_3', 'trip_3', 'c_new_york-usa', '2026-08-08', '2026-08-12', 140, 760, 1],
    ['stop_4', 'trip_4', 'c_paris-france', '2026-09-01', '2026-09-07', 110, 850, 1],
    ['stop_5', 'trip_5', 'c_sydney-australia', '2026-10-01', '2026-10-10', 150, 900, 1]
  ];

  for (const [id, tripId, cityId, arr, dep, transport, stay, orderNum] of stops) {
    await runAsync(
      `INSERT OR IGNORE INTO stops (id, trip_id, city_id, arrival_date, depart_date, transport_cost, stay_cost, order_num)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, tripId, cityId, arr, dep, transport, stay, orderNum]
    );
  }

  // 15 diverse community posts
  const postTitles = [
    'Sunrise Over the City',
    'Hidden Gem Local Eats',
    'Adventure Awaits',
    'City Lights Magic',
    'Cultural Immersion Journey',
    'Street Art Discoveries',
    'Mountain Peak Views',
    'Beach Paradise Found',
    'Historic Wonders Tour',
    'Modern Architecture',
    'Local Market Vibes',
    'Festival Celebrations',
    'Sunset Perfection',
    'Underground Scene Explored',
    'Urban Exploration Quest'
  ];

  const postExperiences = [
    'Explored vibrant night markets and tasted incredible street food that locals love.',
    'Found an amazing viewpoint that tourists rarely discover - worth the hike!',
    'The historical architecture here is absolutely breathtaking and stunning.',
    'Met fellow travelers and shared stories all night long.',
    'Hiked to the summit and the panoramic views were worth every step.',
    'Tried authentic local cuisine at a family-run restaurant we stumbled upon.',
    'The street art scene here is incredibly creative and inspiring.',
    'Spent the day wandering through peaceful old town streets and charming alleyways.',
    'Caught the sunset from the perfect spot overlooking the entire city.',
    'Visited a festival and experienced the local culture firsthand and authentically.',
    'The public transportation is efficient, clean, and very affordable here.',
    'Discovered a cozy café perfect for morning coffee and people watching.',
    'Took cooking classes with a local chef - highly recommend to anyone visiting!',
    'The museums here offer amazing insights into local history and culture.',
    'Found the best gelato in the city - totally worth the search and detour!'
  ];

  const postImages = [
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800',
    'https://images.unsplash.com/photo-1504674900967-a8fb3e106fb5?w=800',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800',
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800',
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
    'https://images.unsplash.com/photo-1466978822259-cdc46e44802f?w=800',
    'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
    'https://images.unsplash.com/photo-1542839885-d2d5fcf53f46?w=800',
    'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=800',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800',
    'https://images.unsplash.com/photo-1524735409f76abb814d82a675106bae?w=800'
  ];

  for (let i = 0; i < 15; i++) {
    const userIdx = i % 5;
    const tripIdx = i % 5;
    const userId = `u_demo_${userIdx + 1}`;
    const tripId = `trip_${tripIdx + 1}`;
    const title = postTitles[i];
    const experience = postExperiences[i];
    const image = postImages[i];
    const likes = 12 + Math.floor(Math.random() * 48);

    await runAsync(
      `INSERT OR IGNORE INTO trip_posts (id, trip_id, user_id, title, experience, images, likes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [`post_${i + 1}`, tripId, userId, title, experience, image, likes]
    );
  }
}

async function main() {
  try {
    await ensureTables();
    await ensureUsersRoleColumn();
    await seedCities();
    await seedUsersTripsAndPosts();

    const cityCount = await getAsync(`SELECT COUNT(*) as total FROM cities`);
    const userCount = await getAsync(`SELECT COUNT(*) as total FROM users`);
    const postCount = await getAsync(`SELECT COUNT(*) as total FROM trip_posts`);

    console.log(`\n🎉 Database seeding complete!\n`);
    console.log(`✅ Seeded cities: ${cityCount.total}`);
    console.log(`✅ Seeded users: ${userCount.total}`);
    console.log(`✅ Seeded community posts: ${postCount.total}`);
    console.log(`\n📧 Admin login: admin@traveloop.io / Admin@12345`);
    console.log(`📧 Demo login: ava@traveloop.io / Demo@12345`);
    console.log(`\n🚀 Ready to start: npm start\n`);
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    process.exitCode = 1;
  } finally {
    db.close();
  }
}

main();
