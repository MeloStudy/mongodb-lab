const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'large-file.dat');
const targetSize = 20 * 1024 * 1024; // 20 MB

const stream = fs.createWriteStream(filePath);

let currentSize = 0;
let lineCount = 0;

console.log(`Generating 20MB file with lines at ${filePath}...`);

while (currentSize < targetSize) {
  const line = `[${new Date().toISOString()}] LOG_ENTRY_${lineCount.toString().padStart(6, '0')}: Simulated satellite data chunk for segment ${Math.random().toString(36).substring(7)}. Metadata: { sensor: "Hires-Alpha", resolution: "0.5m", orbit: "LEO-4" }\n`;
  stream.write(line);
  currentSize += Buffer.byteLength(line);
  lineCount++;
}

stream.end();
stream.on('finish', () => {
  console.log(`Done! Created ${lineCount} lines. Final size: ${(currentSize / 1024 / 1024).toFixed(2)} MB`);
});
