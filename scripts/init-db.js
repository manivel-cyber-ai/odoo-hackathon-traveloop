const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const db = new sqlite3.Database('traveloop.db', (err) => {
  if (err) console.error('Connection error:', err);
  else console.log('Connected to database - seeding data...');
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
    image: cityImageUrl(city.name),
    description: `${city.name} is a top ${city.region.toLowerCase()} destination in ${city.country} with vibrant culture, food, and must-see landmarks.`
  };
}

const citySeed = [
  // Asia
  ['Tokyo', 'Japan', 'Asia'], ['Osaka', 'Japan', 'Asia'], ['Kyoto', 'Japan', 'Asia'], ['Sapporo', 'Japan', 'Asia'],
  ['Seoul', 'South Korea', 'Asia'], ['Busan', 'South Korea', 'Asia'], ['Incheon', 'South Korea', 'Asia'], ['Daegu', 'South Korea', 'Asia'],
  ['Beijing', 'China', 'Asia'], ['Shanghai', 'China', 'Asia'], ['Shenzhen', 'China', 'Asia'], ['Guangzhou', 'China', 'Asia'],
  ['Chengdu', 'China', 'Asia'], ['Xi an', 'China', 'Asia'], ['Hangzhou', 'China', 'Asia'], ['Nanjing', 'China', 'Asia'],
  ['Taipei', 'Taiwan', 'Asia'], ['Kaohsiung', 'Taiwan', 'Asia'], ['Taichung', 'Taiwan', 'Asia'], ['Tainan', 'Taiwan', 'Asia'],
  ['Bangkok', 'Thailand', 'Asia'], ['Chiang Mai', 'Thailand', 'Asia'], ['Phuket', 'Thailand', 'Asia'], ['Pattaya', 'Thailand', 'Asia'],
  ['Singapore', 'Singapore', 'Asia'], ['Kuala Lumpur', 'Malaysia', 'Asia'], ['George Town', 'Malaysia', 'Asia'], ['Johor Bahru', 'Malaysia', 'Asia'],
  ['Jakarta', 'Indonesia', 'Asia'], ['Bali', 'Indonesia', 'Asia'], ['Bandung', 'Indonesia', 'Asia'], ['Surabaya', 'Indonesia', 'Asia'],
  ['Ho Chi Minh City', 'Vietnam', 'Asia'], ['Hanoi', 'Vietnam', 'Asia'], ['Da Nang', 'Vietnam', 'Asia'], ['Nha Trang', 'Vietnam', 'Asia'],
  ['Manila', 'Philippines', 'Asia'], ['Cebu', 'Philippines', 'Asia'], ['Davao', 'Philippines', 'Asia'], ['Baguio', 'Philippines', 'Asia'],
  ['Dubai', 'UAE', 'Asia'], ['Abu Dhabi', 'UAE', 'Asia'], ['Sharjah', 'UAE', 'Asia'], ['Doha', 'Qatar', 'Asia'],
  ['Riyadh', 'Saudi Arabia', 'Asia'], ['Jeddah', 'Saudi Arabia', 'Asia'], ['Muscat', 'Oman', 'Asia'], ['Kuwait City', 'Kuwait', 'Asia'],
  ['Istanbul', 'Turkey', 'Asia'], ['Ankara', 'Turkey', 'Asia'], ['Izmir', 'Turkey', 'Asia'], ['Antalya', 'Turkey', 'Asia'],
  ['Mumbai', 'India', 'Asia'], ['Delhi', 'India', 'Asia'], ['Bengaluru', 'India', 'Asia'], ['Chennai', 'India', 'Asia'],
  ['Hyderabad', 'India', 'Asia'], ['Kolkata', 'India', 'Asia'], ['Pune', 'India', 'Asia'], ['Ahmedabad', 'India', 'Asia'],
  ['Kathmandu', 'Nepal', 'Asia'], ['Colombo', 'Sri Lanka', 'Asia'], ['Dhaka', 'Bangladesh', 'Asia'], ['Lahore', 'Pakistan', 'Asia'],
  // Europe
  ['London', 'United Kingdom', 'Europe'], ['Manchester', 'United Kingdom', 'Europe'], ['Edinburgh', 'United Kingdom', 'Europe'], ['Bristol', 'United Kingdom', 'Europe'],
  ['Paris', 'France', 'Europe'], ['Lyon', 'France', 'Europe'], ['Marseille', 'France', 'Europe'], ['Nice', 'France', 'Europe'],
  ['Barcelona', 'Spain', 'Europe'], ['Madrid', 'Spain', 'Europe'], ['Valencia', 'Spain', 'Europe'], ['Seville', 'Spain', 'Europe'],
  ['Rome', 'Italy', 'Europe'], ['Milan', 'Italy', 'Europe'], ['Florence', 'Italy', 'Europe'], ['Naples', 'Italy', 'Europe'],
  ['Berlin', 'Germany', 'Europe'], ['Munich', 'Germany', 'Europe'], ['Hamburg', 'Germany', 'Europe'], ['Frankfurt', 'Germany', 'Europe'],
  ['Amsterdam', 'Netherlands', 'Europe'], ['Rotterdam', 'Netherlands', 'Europe'], ['The Hague', 'Netherlands', 'Europe'], ['Utrecht', 'Netherlands', 'Europe'],
  ['Brussels', 'Belgium', 'Europe'], ['Antwerp', 'Belgium', 'Europe'], ['Ghent', 'Belgium', 'Europe'], ['Bruges', 'Belgium', 'Europe'],
  ['Zurich', 'Switzerland', 'Europe'], ['Geneva', 'Switzerland', 'Europe'], ['Basel', 'Switzerland', 'Europe'], ['Bern', 'Switzerland', 'Europe'],
  ['Vienna', 'Austria', 'Europe'], ['Salzburg', 'Austria', 'Europe'], ['Graz', 'Austria', 'Europe'], ['Innsbruck', 'Austria', 'Europe'],
  ['Prague', 'Czechia', 'Europe'], ['Brno', 'Czechia', 'Europe'], ['Ostrava', 'Czechia', 'Europe'], ['Plzen', 'Czechia', 'Europe'],
  ['Budapest', 'Hungary', 'Europe'], ['Debrecen', 'Hungary', 'Europe'], ['Szeged', 'Hungary', 'Europe'], ['Pecs', 'Hungary', 'Europe'],
  ['Warsaw', 'Poland', 'Europe'], ['Krakow', 'Poland', 'Europe'], ['Gdansk', 'Poland', 'Europe'], ['Wroclaw', 'Poland', 'Europe'],
  ['Stockholm', 'Sweden', 'Europe'], ['Gothenburg', 'Sweden', 'Europe'], ['Malmo', 'Sweden', 'Europe'], ['Uppsala', 'Sweden', 'Europe'],
  ['Oslo', 'Norway', 'Europe'], ['Bergen', 'Norway', 'Europe'], ['Trondheim', 'Norway', 'Europe'], ['Stavanger', 'Norway', 'Europe'],
  ['Copenhagen', 'Denmark', 'Europe'], ['Aarhus', 'Denmark', 'Europe'], ['Odense', 'Denmark', 'Europe'], ['Aalborg', 'Denmark', 'Europe'],
  ['Helsinki', 'Finland', 'Europe'], ['Turku', 'Finland', 'Europe'], ['Tampere', 'Finland', 'Europe'], ['Oulu', 'Finland', 'Europe'],
  // Americas
  ['New York', 'USA', 'Americas'], ['Los Angeles', 'USA', 'Americas'], ['Chicago', 'USA', 'Americas'], ['San Francisco', 'USA', 'Americas'],
  ['Miami', 'USA', 'Americas'], ['Seattle', 'USA', 'Americas'], ['Boston', 'USA', 'Americas'], ['Houston', 'USA', 'Americas'],
  ['Toronto', 'Canada', 'Americas'], ['Vancouver', 'Canada', 'Americas'], ['Montreal', 'Canada', 'Americas'], ['Calgary', 'Canada', 'Americas'],
  ['Mexico City', 'Mexico', 'Americas'], ['Guadalajara', 'Mexico', 'Americas'], ['Monterrey', 'Mexico', 'Americas'], ['Cancun', 'Mexico', 'Americas'],
  ['Rio de Janeiro', 'Brazil', 'Americas'], ['Sao Paulo', 'Brazil', 'Americas'], ['Brasilia', 'Brazil', 'Americas'], ['Salvador', 'Brazil', 'Americas'],
  ['Buenos Aires', 'Argentina', 'Americas'], ['Cordoba', 'Argentina', 'Americas'], ['Mendoza', 'Argentina', 'Americas'], ['Rosario', 'Argentina', 'Americas'],
  ['Santiago', 'Chile', 'Americas'], ['Valparaiso', 'Chile', 'Americas'], ['Concepcion', 'Chile', 'Americas'], ['La Serena', 'Chile', 'Americas'],
  ['Lima', 'Peru', 'Americas'], ['Cusco', 'Peru', 'Americas'], ['Arequipa', 'Peru', 'Americas'], ['Trujillo', 'Peru', 'Americas'],
  ['Bogota', 'Colombia', 'Americas'], ['Medellin', 'Colombia', 'Americas'], ['Cartagena', 'Colombia', 'Americas'], ['Cali', 'Colombia', 'Americas'],
  ['Quito', 'Ecuador', 'Americas'], ['Guayaquil', 'Ecuador', 'Americas'], ['Cuenca', 'Ecuador', 'Americas'], ['Loja', 'Ecuador', 'Americas'],
  ['La Paz', 'Bolivia', 'Americas'], ['Santa Cruz', 'Bolivia', 'Americas'], ['Sucre', 'Bolivia', 'Americas'], ['Cochabamba', 'Bolivia', 'Americas'],
  ['Montevideo', 'Uruguay', 'Americas'], ['Punta del Este', 'Uruguay', 'Americas'], ['Salto', 'Uruguay', 'Americas'], ['Colonia del Sacramento', 'Uruguay', 'Americas'],
  ['San Jose', 'Costa Rica', 'Americas'], ['Liberia', 'Costa Rica', 'Americas'], ['Heredia', 'Costa Rica', 'Americas'], ['Cartago', 'Costa Rica', 'Americas'],
  ['Panama City', 'Panama', 'Americas'], ['Colon', 'Panama', 'Americas'], ['David', 'Panama', 'Americas'], ['Santiago de Veraguas', 'Panama', 'Americas'],
  // Africa
  ['Cairo', 'Egypt', 'Africa'], ['Alexandria', 'Egypt', 'Africa'], ['Giza', 'Egypt', 'Africa'], ['Luxor', 'Egypt', 'Africa'],
  ['Casablanca', 'Morocco', 'Africa'], ['Marrakesh', 'Morocco', 'Africa'], ['Rabat', 'Morocco', 'Africa'], ['Fes', 'Morocco', 'Africa'],
  ['Tunis', 'Tunisia', 'Africa'], ['Sfax', 'Tunisia', 'Africa'], ['Sousse', 'Tunisia', 'Africa'], ['Bizerte', 'Tunisia', 'Africa'],
  ['Algiers', 'Algeria', 'Africa'], ['Oran', 'Algeria', 'Africa'], ['Constantine', 'Algeria', 'Africa'], ['Annaba', 'Algeria', 'Africa'],
  ['Lagos', 'Nigeria', 'Africa'], ['Abuja', 'Nigeria', 'Africa'], ['Kano', 'Nigeria', 'Africa'], ['Port Harcourt', 'Nigeria', 'Africa'],
  ['Accra', 'Ghana', 'Africa'], ['Kumasi', 'Ghana', 'Africa'], ['Tamale', 'Ghana', 'Africa'], ['Takoradi', 'Ghana', 'Africa'],
  ['Nairobi', 'Kenya', 'Africa'], ['Mombasa', 'Kenya', 'Africa'], ['Kisumu', 'Kenya', 'Africa'], ['Nakuru', 'Kenya', 'Africa'],
  ['Addis Ababa', 'Ethiopia', 'Africa'], ['Dire Dawa', 'Ethiopia', 'Africa'], ['Bahir Dar', 'Ethiopia', 'Africa'], ['Mekele', 'Ethiopia', 'Africa'],
  ['Kampala', 'Uganda', 'Africa'], ['Entebbe', 'Uganda', 'Africa'], ['Jinja', 'Uganda', 'Africa'], ['Gulu', 'Uganda', 'Africa'],
  ['Kigali', 'Rwanda', 'Africa'], ['Butare', 'Rwanda', 'Africa'], ['Musanze', 'Rwanda', 'Africa'], ['Gisenyi', 'Rwanda', 'Africa'],
  ['Johannesburg', 'South Africa', 'Africa'], ['Cape Town', 'South Africa', 'Africa'], ['Durban', 'South Africa', 'Africa'], ['Pretoria', 'South Africa', 'Africa'],
  ['Windhoek', 'Namibia', 'Africa'], ['Swakopmund', 'Namibia', 'Africa'], ['Walvis Bay', 'Namibia', 'Africa'], ['Luderitz', 'Namibia', 'Africa'],
  ['Gaborone', 'Botswana', 'Africa'], ['Francistown', 'Botswana', 'Africa'], ['Maun', 'Botswana', 'Africa'], ['Kasane', 'Botswana', 'Africa'],
  // Oceania
  ['Sydney', 'Australia', 'Oceania'], ['Melbourne', 'Australia', 'Oceania'], ['Brisbane', 'Australia', 'Oceania'], ['Perth', 'Australia', 'Oceania'],
  ['Adelaide', 'Australia', 'Oceania'], ['Canberra', 'Australia', 'Oceania'], ['Hobart', 'Australia', 'Oceania'], ['Darwin', 'Australia', 'Oceania'],
  ['Auckland', 'New Zealand', 'Oceania'], ['Wellington', 'New Zealand', 'Oceania'], ['Christchurch', 'New Zealand', 'Oceania'], ['Queenstown', 'New Zealand', 'Oceania'],
  ['Suva', 'Fiji', 'Oceania'], ['Nadi', 'Fiji', 'Oceania'], ['Lautoka', 'Fiji', 'Oceania'], ['Labasa', 'Fiji', 'Oceania'],
  ['Port Moresby', 'Papua New Guinea', 'Oceania'], ['Lae', 'Papua New Guinea', 'Oceania'], ['Madang', 'Papua New Guinea', 'Oceania'], ['Mount Hagen', 'Papua New Guinea', 'Oceania'],
  ['Apia', 'Samoa', 'Oceania'], ['Pago Pago', 'American Samoa', 'Oceania'], ['Nukualofa', 'Tonga', 'Oceania'], ['Port Vila', 'Vanuatu', 'Oceania']
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
    ['u_admin', 'Traveloop Admin', adminEmail, adminPassword, 'Singapore', 'Singapore', 'Platform administrator']
  );

  await runAsync(`UPDATE users SET is_admin = 1 WHERE id = 'u_admin'`);

  const demoUsers = [
    ['u_demo_1', 'Ava Wander', 'ava@traveloop.io', 'Tokyo', 'Japan'],
    ['u_demo_2', 'Noah Miles', 'noah@traveloop.io', 'Barcelona', 'Spain'],
    ['u_demo_3', 'Mia Globe', 'mia@traveloop.io', 'New York', 'USA']
  ];

  for (const [id, name, email, city, country] of demoUsers) {
    const pwd = await bcrypt.hash('Demo@12345', 10);
    await runAsync(
      `INSERT OR IGNORE INTO users (id, name, email, password, city, country, info, is_admin)
       VALUES (?, ?, ?, ?, ?, ?, ?, 0)`,
      [id, name, email, pwd, city, country, 'Seeded demo traveler account']
    );
  }

  const cityTokyo = await getAsync(`SELECT id, image FROM cities WHERE name = ? LIMIT 1`, ['Tokyo']);
  const cityBarcelona = await getAsync(`SELECT id, image FROM cities WHERE name = ? LIMIT 1`, ['Barcelona']);
  const cityNewYork = await getAsync(`SELECT id, image FROM cities WHERE name = ? LIMIT 1`, ['New York']);

  const trips = [
    ['trip_demo_1', 'u_demo_1', 'Japan Culture Loop', 'Temples, food streets, and city nights', '2026-06-04', '2026-06-14', 2600],
    ['trip_demo_2', 'u_demo_2', 'Iberian Art Trail', 'Architecture and coastal city breaks', '2026-07-01', '2026-07-12', 3100],
    ['trip_demo_3', 'u_demo_3', 'US East Coast Sprint', 'Fast-paced city highlights', '2026-08-08', '2026-08-16', 2900]
  ];

  for (const [id, userId, name, description, startDate, endDate, budget] of trips) {
    await runAsync(
      `INSERT OR IGNORE INTO trips (id, user_id, name, description, start_date, end_date, budget, is_public, share_token)
       VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?)`,
      [id, userId, name, description, startDate, endDate, budget, `share_${id}`]
    );
  }

  const stops = [
    ['stop_demo_1', 'trip_demo_1', cityTokyo ? cityTokyo.id : null, '2026-06-04', '2026-06-08', 120, 680, 1],
    ['stop_demo_2', 'trip_demo_2', cityBarcelona ? cityBarcelona.id : null, '2026-07-01', '2026-07-05', 100, 720, 1],
    ['stop_demo_3', 'trip_demo_3', cityNewYork ? cityNewYork.id : null, '2026-08-08', '2026-08-12', 140, 760, 1]
  ];

  for (const [id, tripId, cityId, arr, dep, transport, stay, orderNum] of stops) {
    if (!cityId) continue;
    await runAsync(
      `INSERT OR IGNORE INTO stops (id, trip_id, city_id, arrival_date, depart_date, transport_cost, stay_cost, order_num)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, tripId, cityId, arr, dep, transport, stay, orderNum]
    );
  }

  const posts = [
    ['post_seed_1', 'trip_demo_1', 'u_demo_1', 'Tokyo Night Streets', 'Shibuya after sunset was full of energy, street food, and incredible city lights.', cityTokyo ? cityTokyo.image : cityImageUrl('Tokyo'), 18],
    ['post_seed_2', 'trip_demo_2', 'u_demo_2', 'Barcelona Beach Morning', 'Started the day with a sunrise walk and local coffee near Barceloneta.', cityBarcelona ? cityBarcelona.image : cityImageUrl('Barcelona'), 27],
    ['post_seed_3', 'trip_demo_3', 'u_demo_3', 'NYC Skyline Moments', 'The skyline from Brooklyn Bridge at dusk is a must-see experience.', cityNewYork ? cityNewYork.image : cityImageUrl('New York'), 34]
  ];

  for (const [id, tripId, userId, title, experience, image, likes] of posts) {
    await runAsync(
      `INSERT OR IGNORE INTO trip_posts (id, trip_id, user_id, title, experience, images, likes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, tripId, userId, title, experience, image, likes]
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

    console.log(`Seeded cities: ${cityCount.total}`);
    console.log(`Seeded users: ${userCount.total}`);
    console.log(`Seeded community posts: ${postCount.total}`);
    console.log('Admin login: admin@traveloop.io / Admin@12345');
    console.log('Demo login: ava@traveloop.io / Demo@12345');
  } catch (err) {
    console.error('Seeding failed:', err.message);
    process.exitCode = 1;
  } finally {
    db.close();
  }
}

main();
