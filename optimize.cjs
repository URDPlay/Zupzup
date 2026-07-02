const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const files = ['cctv_mathura.png', 'cctv_palwal.png', 'hero_bg.png'];

async function optimizeImages() {
  for (const file of files) {
    const inputPath = path.join(publicDir, file);
    const outputPath = path.join(publicDir, file.replace('.png', '.webp'));
    
    if (fs.existsSync(inputPath)) {
      console.log(`Converting ${file}...`);
      await sharp(inputPath)
        .webp({ quality: 80 })
        .toFile(outputPath);
      console.log(`Converted ${file} to WebP`);
      
      // Delete original PNG
      fs.unlinkSync(inputPath);
      console.log(`Deleted ${file}`);
    } else {
      console.log(`${file} not found`);
    }
  }
}

optimizeImages().catch(console.error);
