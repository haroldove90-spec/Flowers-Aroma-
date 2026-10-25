import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

// Function to create an uncompressed PNG buffer using pure Node.js (zlib)
function createSolidPNG(width, height, getPixel) {
  // getPixel(x, y) returns [r, g, b, a]
  const rowLength = 1 + width * 4; // 1 filter byte (0) + 4 bytes per pixel
  const rawData = Buffer.alloc(rowLength * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowLength;
    rawData[rowOffset] = 0; // Filter type None
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = getPixel(x, y, width, height);
      const pxOffset = rowOffset + 1 + x * 4;
      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const compressed = zlib.deflateSync(rawData);

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // 8 bits per channel
  ihdrData[9] = 6; // Color type 6 (RGBA)
  ihdrData[10] = 0; // Compression deflate
  ihdrData[11] = 0; // Filter
  ihdrData[12] = 0; // Interlace

  const ihdrChunk = createChunk('IHDR', ihdrData);
  const idatChunk = createChunk('IDAT', compressed);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const length = data.length;
  const chunk = Buffer.alloc(12 + length);
  chunk.writeUInt32BE(length, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const crc = crc32(chunk.subarray(4, 8 + length));
  chunk.writeInt32BE(crc, 8 + length);
  return chunk;
}

// CRC32 implementation
const crcTable = new Int32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ -1);
}

// Color generator for Aroma Flowers brand:
// Forest Green (#15803d: 21, 128, 61), Dark Emerald (#064e3b: 6, 78, 59), Crimson Red (#dc2626: 220, 38, 38)
function getAromaPixel(x, y, w, h, isMaskable = false) {
  const cx = w / 2;
  const cy = h / 2;
  const r = w / 2;
  const dx = x - cx;
  const dy = y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // Background
  const bgR = 15; // deep forest dark
  const bgG = 35;
  const bgB = 25;

  if (isMaskable) {
    // Solid background for full maskable area
    // Flower in safe circle (radius 0.35 of w)
    const flowerRadius = r * 0.42;
    if (dist < flowerRadius) {
      // Petal pattern or central flower
      const angle = Math.atan2(dy, dx);
      const petalDist = flowerRadius * (0.75 + 0.25 * Math.cos(5 * angle));
      if (dist < petalDist * 0.5) {
        // Red flower core
        return [220, 38, 38, 255]; // Red #dc2626
      } else if (dist < petalDist) {
        // Emerald leaf/petal
        return [22, 163, 74, 255]; // Green #16a34a
      }
    }
    // Greenhouse arch line
    if (Math.abs(dy - 0) < r * 0.55 && Math.abs(dx) < r * 0.55) {
      const archDist = Math.sqrt(dx * dx + (dy + r * 0.15) * (dy + r * 0.15));
      if (Math.abs(archDist - r * 0.58) < 4) {
        return [255, 255, 255, 180];
      }
    }
    return [bgR, bgG, bgB, 255];
  }

  // Non-maskable: rounded squircle / transparent outer or circular badge
  if (dist > r - 2) {
    return [0, 0, 0, 0];
  }

  // Ring border (Gold/Green)
  if (dist > r - 12) {
    return [34, 197, 94, 255]; // Light green ring
  }

  // Flower badge inside
  const flowerRadius = r * 0.55;
  if (dist < flowerRadius) {
    const angle = Math.atan2(dy, dx);
    const petalDist = flowerRadius * (0.8 + 0.2 * Math.cos(5 * angle));
    if (dist < petalDist * 0.45) {
      return [220, 38, 38, 255]; // Red core #dc2626
    }
    if (dist < petalDist) {
      return [22, 163, 74, 255]; // Green petal #16a34a
    }
  }

  // Background of badge: dark forest green
  return [15, 45, 30, 255];
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate sizes
const sizes = [
  { file: 'pwa-192x192.png', size: 192, maskable: false },
  { file: 'pwa-512x512.png', size: 512, maskable: false },
  { file: 'pwa-maskable-512x512.png', size: 512, maskable: true },
  { file: 'apple-touch-icon.png', size: 180, maskable: true },
];

for (const s of sizes) {
  const buf = createSolidPNG(s.size, s.size, (x, y, w, h) => getAromaPixel(x, y, w, h, s.maskable));
  fs.writeFileSync(path.join(publicDir, s.file), buf);
  console.log(`Generated ${s.file} (${s.size}x${s.size})`);
}

// Favicon 32x32
const favBuf = createSolidPNG(32, 32, (x, y, w, h) => getAromaPixel(x, y, w, h, false));
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), favBuf);
console.log('Generated favicon.ico');
