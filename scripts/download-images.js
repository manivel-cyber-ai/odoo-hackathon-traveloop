const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const uploadsDir = path.join(__dirname, '../uploads/cities');

// Create uploads directory if it doesn't exist
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// High-quality image URLs from reliable sources
const cityImages = {
  'Tokyo': 'https://images.unsplash.com/photo-1540959375944-7049f642e9cc?w=800&h=600&fit=crop&q=80',
  'Osaka': 'https://images.unsplash.com/photo-1595433707802-6b2626ef1c91?w=800&h=600&fit=crop&q=80',
  'Kyoto': 'https://images.unsplash.com/photo-1522383150241-6829328a5333?w=800&h=600&fit=crop&q=80',
  'Seoul': 'https://images.unsplash.com/photo-1537823741301-5b8c0644552d?w=800&h=600&fit=crop&q=80',
  'Bangkok': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&q=80',
  'Singapore': 'https://images.unsplash.com/photo-1512453693377-d2e15d1dd58d?w=800&h=600&fit=crop&q=80',
  'Hong Kong': 'https://images.unsplash.com/photo-1523639033778-681c00912498?w=800&h=600&fit=crop&q=80',
  'Beijing': 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&h=600&fit=crop&q=80',
  'Shanghai': 'https://images.unsplash.com/photo-1522202176988-696c374facba?w=800&h=600&fit=crop&q=80',
  'London': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=600&fit=crop&q=80',
  'Paris': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=600&fit=crop&q=80',
  'Barcelona': 'https://images.unsplash.com/photo-1566992842260-81e2c5b1f14e?w=800&h=600&fit=crop&q=80',
  'Rome': 'https://images.unsplash.com/photo-1552832855-8ac426a159d1?w=800&h=600&fit=crop&q=80',
  'Amsterdam': 'https://images.unsplash.com/photo-1561887446-d3fee7d55364?w=800&h=600&fit=crop&q=80',
  'Berlin': 'https://images.unsplash.com/photo-1509904950645-c92da32a5f2f?w=800&h=600&fit=crop&q=80',
  'Vienna': 'https://images.unsplash.com/photo-1516876617822-94c1f2d4d742?w=800&h=600&fit=crop&q=80',
  'Prague': 'https://images.unsplash.com/photo-1508550366788-4891c1c5a5b9?w=800&h=600&fit=crop&q=80',
  'Istanbul': 'https://images.unsplash.com/photo-1576502200916-3808e07386a5?w=800&h=600&fit=crop&q=80',
  'New York': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=600&fit=crop&q=80',
  'Los Angeles': 'https://images.unsplash.com/photo-1509015307313-d890b07b29a9?w=800&h=600&fit=crop&q=80',
  'Chicago': 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&h=600&fit=crop&q=80',
  'Miami': 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&h=600&fit=crop&q=80',
  'San Francisco': 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop&q=80',
  'Toronto': 'https://images.unsplash.com/photo-1536431311894-438ea42e3d13?w=800&h=600&fit=crop&q=80',
  'Vancouver': 'https://images.unsplash.com/photo-1559332007-b5ac70737a48?w=800&h=600&fit=crop&q=80',
  'Mexico City': 'https://images.unsplash.com/photo-1518904479831-e4d8ebfce6d9?w=800&h=600&fit=crop&q=80',
  'Rio de Janeiro': 'https://images.unsplash.com/photo-1465229872749-10cbb09c05a9?w=800&h=600&fit=crop&q=80',
  'Buenos Aires': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&q=80',
  'Santiago': 'https://images.unsplash.com/photo-1535739066554-96a2c1f59c63?w=800&h=600&fit=crop&q=80',
  'Cairo': 'https://images.unsplash.com/photo-1552832855-4eb6ca1db52b?w=800&h=600&fit=crop&q=80',
  'Nairobi': 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&h=600&fit=crop&q=80',
  'Cape Town': 'https://images.unsplash.com/photo-1516534775068-bb57abdfe639?w=800&h=600&fit=crop&q=80',
  'Sydney': 'https://images.unsplash.com/photo-1506973404872-a4a50e48c4d5?w=800&h=600&fit=crop&q=80',
  'Melbourne': 'https://images.unsplash.com/photo-1506973404872-a4a50e48c4d5?w=800&h=600&fit=crop&q=80',
  'Auckland': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=600&fit=crop&q=80',
  'Dubai': 'https://images.unsplash.com/photo-1512453693377-d2e15d1dd58d?w=800&h=600&fit=crop&q=80'
};

function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filepath = path.join(uploadsDir, filename);
    
    // Check if already exists
    if (fs.existsSync(filepath)) {
      console.log(`⏭️  Already downloaded: ${filename}`);
      return resolve(filepath);
    }

    const file = fs.createWriteStream(filepath);
    const protocol = url.startsWith('https') ? https : http;

    protocol.get(url, { timeout: 10000 }, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`✅ Downloaded: ${filename}`);
        resolve(filepath);
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

async function main() {
  console.log('📥 Starting image downloads...\n');
  
  let downloaded = 0;
  let failed = 0;

  for (const [cityName, url] of Object.entries(cityImages)) {
    const filename = `${cityName.toLowerCase().replace(/\s+/g, '-')}.jpg`;
    try {
      await downloadImage(url, filename);
      downloaded++;
    } catch (err) {
      console.error(`❌ Failed to download ${cityName}: ${err.message}`);
      failed++;
    }
  }

  console.log(`\n🎉 Download complete!`);
  console.log(`✅ Downloaded: ${downloaded}`);
  console.log(`⚠️  Failed: ${failed}`);
  console.log(`\n💾 Images stored in: ${uploadsDir}\n`);
}

main().catch(console.error);
