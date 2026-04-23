const fs = require('fs');
const path = require('path');

/**
 * LAB-007: Specialized Data & GridFS
 * 
 * This script generates a 20MB file to be used in GridFS exercises.
 * It uses repeating patterns with newlines to ensure it is editor-friendly
 * and easily chunkable by MongoDB.
 */

const FILE_NAME = 'large-file.dat';
const TARGET_SIZE_MB = 20;
const TARGET_SIZE_BYTES = TARGET_SIZE_MB * 1024 * 1024;

const CHUNK_CONTENT = 'MONGODB_LAB_007_SATELLITE_DATA_STREAM_CHUNK_VALIDATION_STRING\n';

function generate() {
    console.log(`🚀 Generating ${FILE_NAME} (${TARGET_SIZE_MB}MB)...`);
    
    const filePath = path.join(__dirname, FILE_NAME);
    const writeStream = fs.createWriteStream(filePath);
    
    let currentSize = 0;
    let lineCount = 1;
    
    while (currentSize < TARGET_SIZE_BYTES) {
        const linePrefix = `[LINE-${String(lineCount).padStart(6, '0')}] `;
        const lineContent = `${linePrefix}${CHUNK_CONTENT}`;
        
        const remaining = TARGET_SIZE_BYTES - currentSize;
        const dataToWrite = remaining < lineContent.length 
            ? lineContent.slice(0, remaining) 
            : lineContent;
            
        writeStream.write(dataToWrite);
        currentSize += dataToWrite.length;
        lineCount++;
    }
    
    writeStream.end();
    
    writeStream.on('finish', () => {
        console.log(`✅ Success! File generated at: ${filePath}`);
        console.log(`📏 Final size: ${(fs.statSync(filePath).size / (1024 * 1024)).toFixed(2)} MB`);
    });

    writeStream.on('error', (err) => {
        console.error('❌ Error generating file:', err);
        process.exit(1);
    });
}

generate();
