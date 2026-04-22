const { MongoClient } = require('mongodb');

/**
 * LAB-006: Advanced Updates & Array Surgery
 * 
 * Task: Implement the following update scenarios for the Smart Home System.
 */

async function run() {
  const uri = 'mongodb://localhost:27017';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const dbName = process.env.DB_NAME || 'smart_home_test';
    const db = client.db(dbName);
    const collection = db.collection('devices');

    // 0. SEEDING: Reset to initial state for the lab
    await collection.deleteMany({});
    await collection.insertMany([
      { 
        id: "thermostat-01", 
        type: "hvac",
        metadata: { model: "T-1000", voltage: 5, consumption: 1.2 },
        reboots: 10,
        tags: ["home-office"],
        components: [
          { id: "temp-sensor", active: true, calibrated: false },
          { id: "wifi-modem", active: true, calibrated: true }
        ],
        logs: []
      },
      { 
        id: "bulb-01", 
        type: "lighting",
        metadata: { model: "L-X", voltage: 110, consumption: 9.5 },
        reboots: 2,
        tags: ["living-room"],
        components: [
          { id: "led-strip", active: false, calibrated: true }
        ],
        logs: []
      }
    ]);
    console.log('🌱 Data seeded successfully.');

    // 1. SCENARIO: Atomic Field Surgery
    // Task: Increment 'reboots' by 1, rename 'metadata.voltage' to 'metadata.v_input',
    // and remove 'reboots' from bulb-01.
    await collection.updateOne(
      { id: "thermostat-01" },
      { 
        $inc: { reboots: 1 },
        $rename: { "metadata.voltage": "metadata.v_input" }
      }
    );

    await collection.updateOne(
      { id: "bulb-01" },
      { $unset: { reboots: "" } }
    );

    // 2. SCENARIO: Array Management
    // Task: Add "automated" to tags (only if not present) and add a new log entry
    await collection.updateOne(
      { id: "bulb-01" },
      { 
        $addToSet: { tags: "automated" },
        $push: { logs: { event: "manual_override", ts: new Date() } }
      }
    );

    // 3. SCENARIO: Positional Surgery ($ and arrayFilters)
    // Task A: Update the first uncalibrated component to active: false
    await collection.updateOne(
      { id: "thermostat-01", "components.calibrated": false },
      { $set: { "components.$.active": false } }
    );

    // Task B: Set 'calibrated: true' ONLY for the 'temp-sensor' component in 'thermostat-01'
    await collection.updateOne(
      { id: "thermostat-01" },
      { $set: { "components.$[c].calibrated": true } },
      { arrayFilters: [ { "c.id": "temp-sensor" } ] }
    );

    // 4. SCENARIO: Idempotent Upsert
    // Task: Ensure a 'hub-01' device exists. If it doesn't, create it with type 'gateway'.
    await collection.updateOne(
      { id: "hub-01" },
      { 
        $setOnInsert: { 
          type: "gateway",
          status: "ready", 
          created_at: new Date() 
        } 
      },
      { upsert: true }
    );

    console.log('✅ Updates completed successfully.');
  } catch (err) {
    console.error('Error during updates:', err);
  } finally {
    await client.close();
  }
}

run();
