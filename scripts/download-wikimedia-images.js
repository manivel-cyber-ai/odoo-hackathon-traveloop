#!/usr/bin/env node

/**
 * Download city images from Wikimedia Commons (reliable, no rate limits)
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '../uploads/cities');

// Wikimedia Commons URLs - high quality, verified city images
const cityImages = {
  'amsterdam': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Amsterdam_Montelbaan.jpg/800px-Amsterdam_Montelbaan.jpg',
  'barcelona': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Barcelona_-_Sagrada_Familia_%281%29.jpg/800px-Barcelona_-_Sagrada_Familia_%281%29.jpg',
  'berlin': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Berlin_-_Potsdamer_Platz.jpg/800px-Berlin_-_Potsdamer_Platz.jpg',
  'hong-kong': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/HK_Victoria_Harbour_2006-12-22.jpg/800px-HK_Victoria_Harbour_2006-12-22.jpg',
  'kyoto': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Kyoto_Gojo_District_14s5s4350.jpg/800px-Kyoto_Gojo_District_14s5s4350.jpg',
  'paris': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Paris_-_Eiffel_Tower_at_Sunrise_-_La_Tour_Eiffel_%C3%A0_l%27aube.jpg/800px-Paris_-_Eiffel_Tower_at_Sunrise_-_La_Tour_Eiffel_%C3%A0_l%27aube.jpg',
  'rome': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Colosseum_in_Rome-April_2007-1.jpg/800px-Colosseum_in_Rome-April_2007-1.jpg',
};

function downloadImage(city, url) {
  return new Promise((resolve, reject) => {
    const filename = path.join(OUTPUT_DIR, `${city}.jpg`);
    
    // Skip if already exists and has content
    if (fs.existsSync(filename)) {
      const stats = fs.statSync(filename);
      if (stats.size > 0) {
        console.log(`⏭️  ${city.padEnd(15)} : already exists (${(stats.size / 1024).toFixed(1)} KB)`);
        resolve(filename);
        return;
      }
    }

    const file = fs.createWriteStream(filename);

    https.get(url, { timeout: 15000 }, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }

      response.pipe(file);

      file.on('finish', () => {
        file.close();
        const stats = fs.statSync(filename);
        if (stats.size === 0) {
          reject(new Error('Empty response'));
          return;
        }
        console.log(`✅ ${city.padEnd(15)} : ${(stats.size / 1024).toFixed(1)} KB`);
        resolve(filename);
      });
    }).on('error', (err) => {
      fs.unlink(filename, () => {});
      reject(err);
    });
  });
}

async function downloadAllCities() {
  console.log('📷 Downloading city images from Wikimedia Commons...\n');
  console.log('City             Status');
  console.log('─'.repeat(40));

  let success = 0;
  let skipped = 0;
  let failed = 0;

  for (const [city, url] of Object.entries(cityImages)) {
    try {
      await downloadImage(city, url);
      success++;
    } catch (error) {
      console.log(`❌ ${city.padEnd(15)} : ${error.message}`);
      failed++;
    }
  }

  console.log('─'.repeat(40));
  console.log(`\n✅ Downloaded: ${success}`);
  if (skipped > 0) console.log(`⏭️  Already had: ${skipped}`);
  if (failed > 0) console.log(`❌ Failed: ${failed}`);

  // Show summary
  const files = fs.readdirSync(OUTPUT_DIR).filter(f => f.endsWith('.jpg'));
  const totalSize = files.reduce((sum, file) => {
    return sum + fs.statSync(path.join(OUTPUT_DIR, file)).size;
  }, 0);

  console.log(`\n📊 Total city images: ${files.length}/18`);
  console.log(`📊 Total size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
  
  // List missing
  const expected = ['amsterdam', 'bangkok', 'barcelona', 'beijing', 'berlin', 'hong-kong', 
                    'istanbul', 'kyoto', 'london', 'new-york', 'osaka', 'paris', 
                    'prague', 'rome', 'seoul', 'shanghai', 'singapore', 'tokyo', 'vienna'];
  const existing = files.map(f => f.replace('.jpg', ''));
  const missing = expected.filter(c => !existing.includes(c));
  
  if (missing.length > 0) {
    console.log(`\n❓ Missing: ${missing.join(', ')}`);
  } else {
    console.log(`\n✨ All 18 cities have images! Ready to deploy.`);
  }
}

downloadAllCities().catch(console.error);
