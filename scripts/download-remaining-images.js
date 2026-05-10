#!/usr/bin/env node

/**
 * Download remaining city images using alternative sources
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '../uploads/cities');

// Alternative city images for failed downloads
const cityImages = {
  'amsterdam': 'https://images.unsplash.com/photo-1572992122260-81caa3408cc6?w=600&q=80',
  'barcelona': 'https://images.unsplash.com/photo-1579422764355-d69162e398ba?w=600&q=80',
  'berlin': 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&q=80',
  'hong-kong': 'https://images.unsplash.com/photo-1552074886-8b4f62b56c71?w=600&q=80',
  'kyoto': 'https://images.unsplash.com/photo-1522383150241-6c85ef42b882?w=600&q=80',
  'paris': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80',
  'rome': 'https://images.unsplash.com/photo-1552832860-cfb67165eaf0?w=600&q=80',
};

function downloadImage(city, url) {
  return new Promise((resolve, reject) => {
    // Skip if already downloaded
    const filename = path.join(OUTPUT_DIR, `${city}.jpg`);
    if (fs.existsSync(filename)) {
      const stats = fs.statSync(filename);
      console.log(`⏭️  ${city.padEnd(15)} : already downloaded (${(stats.size / 1024).toFixed(1)} KB)`);
      resolve(filename);
      return;
    }

    const file = fs.createWriteStream(filename);

    https.get(url, { timeout: 10000 }, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}`));
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

async function downloadRemaining() {
  console.log('🔄 Downloading remaining city images...\n');
  console.log('City             Size');
  console.log('─'.repeat(30));

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

  console.log('─'.repeat(30));
  console.log(`\n✅ New downloads: ${success}`);
  if (skipped > 0) console.log(`⏭️  Already had: ${skipped}`);
  if (failed > 0) console.log(`❌ Failed: ${failed}`);

  // Show all downloaded files
  const files = fs.readdirSync(OUTPUT_DIR).filter(f => f.endsWith('.jpg'));
  const totalSize = files.reduce((sum, file) => {
    return sum + fs.statSync(path.join(OUTPUT_DIR, file)).size;
  }, 0);

  console.log(`\n📊 Total images: ${files.length}`);
  console.log(`📊 Total size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
}

downloadRemaining().catch(console.error);
