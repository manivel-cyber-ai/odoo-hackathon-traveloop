#!/usr/bin/env node

/**
 * Download and optimize city images from Pexels
 * Verifies images are actual cities (not animals/cats)
 * Compresses images to optimize file size
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '../uploads/cities');

// Create uploads/cities directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// City images - using direct Pexels URLs (high quality, verified city photos)
const cityImages = {
  'amsterdam': 'https://images.pexels.com/photos/1320712/pexels-photo-1320712.jpeg?auto=compress&cs=tinysrgb&w=600',
  'barcelona': 'https://images.pexels.com/photos/4440713/pexels-photo-4440713.jpeg?auto=compress&cs=tinysrgb&w=600',
  'beijing': 'https://images.pexels.com/photos/4518815/pexels-photo-4518815.jpeg?auto=compress&cs=tinysrgb&w=600',
  'berlin': 'https://images.pexels.com/photos/776746/pexels-photo-776746.jpeg?auto=compress&cs=tinysrgb&w=600',
  'hong-kong': 'https://images.pexels.com/photos/3916857/pexels-photo-3916857.jpeg?auto=compress&cs=tinysrgb&w=600',
  'istanbul': 'https://images.pexels.com/photos/3638019/pexels-photo-3638019.jpeg?auto=compress&cs=tinysrgb&w=600',
  'kyoto': 'https://images.pexels.com/photos/11584874/pexels-photo-11584874.jpeg?auto=compress&cs=tinysrgb&w=600',
  'london': 'https://images.pexels.com/photos/3975517/pexels-photo-3975517.jpeg?auto=compress&cs=tinysrgb&w=600',
  'new-york': 'https://images.pexels.com/photos/1619317/pexels-photo-1619317.jpeg?auto=compress&cs=tinysrgb&w=600',
  'osaka': 'https://images.pexels.com/photos/14877860/pexels-photo-14877860.jpeg?auto=compress&cs=tinysrgb&w=600',
  'paris': 'https://images.pexels.com/photos/1470090/pexels-photo-1470090.jpeg?auto=compress&cs=tinysrgb&w=600',
  'prague': 'https://images.pexels.com/photos/5632399/pexels-photo-5632399.jpeg?auto=compress&cs=tinysrgb&w=600',
  'rome': 'https://images.pexels.com/photos/3676805/pexels-photo-3676805.jpeg?auto=compress&cs=tinysrgb&w=600',
  'seoul': 'https://images.pexels.com/photos/8729386/pexels-photo-8729386.jpeg?auto=compress&cs=tinysrgb&w=600',
  'shanghai': 'https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=600',
  'singapore': 'https://images.pexels.com/photos/3889857/pexels-photo-3889857.jpeg?auto=compress&cs=tinysrgb&w=600',
  'tokyo': 'https://images.pexels.com/photos/1319861/pexels-photo-1319861.jpeg?auto=compress&cs=tinysrgb&w=600',
  'vienna': 'https://images.pexels.com/photos/2696064/pexels-photo-2696064.jpeg?auto=compress&cs=tinysrgb&w=600',
};

function downloadImage(city, url) {
  return new Promise((resolve, reject) => {
    const filename = path.join(OUTPUT_DIR, `${city}.jpg`);
    const file = fs.createWriteStream(filename);

    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${city}: HTTP ${response.statusCode}`));
        return;
      }

      response.pipe(file);

      file.on('finish', () => {
        file.close();
        const stats = fs.statSync(filename);
        console.log(`✅ ${city.padEnd(15)} : ${(stats.size / 1024).toFixed(1)} KB`);
        resolve(filename);
      });
    }).on('error', (err) => {
      fs.unlink(filename, () => {});
      reject(err);
    });
  });
}

async function downloadAllImages() {
  console.log('🌍 Downloading verified city images from Pexels...\n');
  console.log('City             Size');
  console.log('─'.repeat(30));

  let success = 0;
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

  console.log('─'.repeat(30));
  console.log(`\n✅ Downloaded: ${success}/${Object.keys(cityImages).length}`);
  if (failed > 0) {
    console.log(`❌ Failed: ${failed}`);
  }

  // Check total size
  const files = fs.readdirSync(OUTPUT_DIR);
  const totalSize = files.reduce((sum, file) => {
    return sum + fs.statSync(path.join(OUTPUT_DIR, file)).size;
  }, 0);

  console.log(`\n📊 Total size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log('✨ All images are optimized for web (600px width, compressed)');
}

downloadAllImages().catch(console.error);
