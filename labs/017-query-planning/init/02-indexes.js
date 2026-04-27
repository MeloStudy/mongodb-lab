// Index setup for Lab 017: Query Planning
const dbName = 'lab_db';
const collectionName = 'telemetry';

const conn = new Mongo();
const db = conn.getDB(dbName);

print('Creating competing indexes...');

// Index 1: Device-centric
db[collectionName].createIndex({ deviceId: 1, timestamp: -1 }, { name: "idx_device_time" });

// Index 2: Status-centric
db[collectionName].createIndex({ status: 1, timestamp: -1 }, { name: "idx_status_time" });

print('Indexes created.');
