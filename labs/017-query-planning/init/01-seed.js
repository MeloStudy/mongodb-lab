// Seed script for Lab 017: Query Planning
const dbName = 'lab_db';
const collectionName = 'telemetry';

const conn = new Mongo();
const db = conn.getDB(dbName);

db[collectionName].drop();

const totalDocs = 10000;
const docs = [];

print(`Generating ${totalDocs} documents...`);

for (let i = 0; i < totalDocs; i++) {
  // deviceId: 100 different devices
  const deviceId = `DEV-${(i % 100).toString().padStart(3, '0')}`;
  
  // timestamp: staggered over the last 10 days
  const timestamp = new Date(Date.now() - (i * 60000));
  
  // status: SKEWED data
  // 95% idle, 5% active
  const status = (i % 20 === 0) ? 'active' : 'idle';
  
  const value = Math.floor(Math.random() * 1000);

  docs.push({
    deviceId,
    timestamp,
    status,
    value,
    metadata: {
      version: "1.0",
      region: (i % 5 === 0) ? "US-EAST" : "US-WEST"
    }
  });

  if (docs.length === 1000) {
    db[collectionName].insertMany(docs);
    docs.length = 0;
  }
}

if (docs.length > 0) {
  db[collectionName].insertMany(docs);
}

print('Seeding complete.');
