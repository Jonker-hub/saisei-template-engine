const fs = require('fs');
const path = require('path');
const wawoff2 = require('wawoff2');

async function convert() {
  const woff2Path = path.join(__dirname, '../public/assets/fonts/66de30cc1b879fdba2e17bfa_PPFragment-SerifLight-2c2db251.woff2');
  const ttfPath = path.join(__dirname, 'PPFragment-SerifLight.ttf');

  const woff2Buffer = fs.readFileSync(woff2Path);
  const ttfBuffer = await wawoff2.decompress(woff2Buffer);
  
  fs.writeFileSync(ttfPath, ttfBuffer);
  console.log('Successfully decompressed woff2 to ttf!');
}

convert().catch(console.error);
