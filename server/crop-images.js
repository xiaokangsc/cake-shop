// 自动裁剪黑边
const { Jimp } = require('jimp');
const path = require('path');
const fs = require('fs');

const INPUT_DIR = path.join(__dirname, '..', 'src', 'static', 'images', 'douyin');
const OUTPUT_DIR = INPUT_DIR;

function isBlack(color) {
  // Jimp 1.x getPixelColor returns integer: 0xRRGGBBAA
  const r = (color >> 24) & 0xFF;
  const g = (color >> 16) & 0xFF;
  const b = (color >> 8) & 0xFF;
  const a = color & 0xFF;
  return a > 200 && r < 30 && g < 30 && b < 30;
}

async function trimBlackBorders(filePath) {
  console.log(`处理: ${path.basename(filePath)}`);
  const image = await Jimp.read(filePath);
  const w = image.width;
  const h = image.height;

  // Top
  let top = 0;
  for (let y = 0; y < h; y++) {
    let blackCount = 0, total = 0;
    for (let x = 0; x < w; x += 3) {
      if (isBlack(image.getPixelColor(x, y))) blackCount++;
      total++;
    }
    if (blackCount / total > 0.9) { top = y + 1; } else { break; }
  }

  // Bottom
  let bottom = h - 1;
  for (let y = h - 1; y >= 0; y--) {
    let blackCount = 0, total = 0;
    for (let x = 0; x < w; x += 3) {
      if (isBlack(image.getPixelColor(x, y))) blackCount++;
      total++;
    }
    if (blackCount / total > 0.9) { bottom = y - 1; } else { break; }
  }

  // Left
  let left = 0;
  for (let x = 0; x < w; x++) {
    let blackCount = 0, total = 0;
    for (let y = 0; y < h; y += 3) {
      if (isBlack(image.getPixelColor(x, y))) blackCount++;
      total++;
    }
    if (blackCount / total > 0.9) { left = x + 1; } else { break; }
  }

  // Right
  let right = w - 1;
  for (let x = w - 1; x >= 0; x--) {
    let blackCount = 0, total = 0;
    for (let y = 0; y < h; y += 3) {
      if (isBlack(image.getPixelColor(x, y))) blackCount++;
      total++;
    }
    if (blackCount / total > 0.9) { right = x - 1; } else { break; }
  }

  top = Math.max(0, Math.min(top, h - 10));
  bottom = Math.max(top + 10, Math.min(bottom, h - 1));
  left = Math.max(0, Math.min(left, w - 10));
  right = Math.max(left + 10, Math.min(right, w - 1));

  const cropW = right - left + 1;
  const cropH = bottom - top + 1;

  console.log(`  原始: ${w}x${h} → 裁剪: ${cropW}x${cropH} (上${top} 左${left})`);

  if (cropW > 0 && cropH > 0 && (cropW < w || cropH < h)) {
    image.crop({ x: left, y: top, w: cropW, h: cropH });
  }

  // 等比缩放到 800 宽
  if (image.width > 800) {
    image.resize({ w: 800 });
    console.log(`  缩放到宽 800px`);
  }

  const ext = path.extname(filePath);
  const basename = path.basename(filePath, ext);
  const outPath = path.join(OUTPUT_DIR, `${basename}_cropped${ext}`);
  await image.write(outPath);
  console.log(`  ✅ 保存: ${path.basename(outPath)} (${image.width}x${image.height})`);
  return outPath;
}

async function main() {
  const files = fs.readdirSync(INPUT_DIR).filter(f => {
    const lower = f.toLowerCase();
    return (lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.png'))
      && !f.includes('_cropped');
  });

  console.log(`找到 ${files.length} 张图片\n`);

  for (const file of files) {
    try {
      await trimBlackBorders(path.join(INPUT_DIR, file));
    } catch (e) {
      console.error(`  ❌ ${file}: ${e.message}`);
    }
  }

  console.log('\n✅ 全部完成！');
}

main();
