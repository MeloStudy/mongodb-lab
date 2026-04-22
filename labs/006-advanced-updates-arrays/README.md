# LAB-006: Advanced Updates (The Smart Home System)

In this lab, you will transition from "Rebuilding" documents to "Performing Surgery" on them using atomic operators. You will manage a fleet of Smart Home Devices.

## Phase 1: Seed Data & Environment Setup

1. Start the environment:
   ```bash
   docker-compose up -d
   ```
2. Connect to the shell:
   ```bash
   docker exec -it mongodb_lab_006 mongosh
   ```
3. **Seed the Data**:
   **Execute the following in the shell**:
   ```javascript
   use smart_home
   db.devices.insertMany([
     { 
       id: "thermostat-01", 
       type: "hvac",
       metadata: { model: "T-1000", voltage: 5, consumption: 1.2 },
       reboots: 10,
       tags: ["home-office"],
       components: [
         { id: "temp-sensor", active: true, calibrated: false },
         { id: "wifi-modem", active: true }
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
   ])
   ```

---

## Phase 2: Field Master (`$inc`, `$mul`, `$set`, `$rename`, `$unset`)

Instead of finding, modifying in Node.js, and saving back, we do it in a single atomic hop.

1. **Task ($inc)**: Increment the `reboots` count of `thermostat-01` by 1.
   ```javascript
   db.devices.updateOne({ id: "thermostat-01" }, { $inc: { reboots: 1 } })
   ```
2. **Task ($mul)**: Adjust power consumption by 10% (multiply by 1.1) for all devices.
   ```javascript
   db.devices.updateMany({}, { $mul: { "metadata.consumption": 1.1 } })
   ```
3. **Task ($set & $rename)**: Update the model and rename `metadata.voltage` to `metadata.v_input`.
   ```javascript
   db.devices.updateOne(
     { id: "thermostat-01" },
     { 
       $set: { "metadata.model": "T-1000" },
       $rename: { "metadata.voltage": "metadata.v_input" }
     }
   )
   ```
4. **Task ($unset)**: Remove the `reboots` field from `bulb-01` (it's not needed for bulbs).
   ```javascript
   db.devices.updateOne({ id: "bulb-01" }, { $unset: { reboots: "" } })
   ```
5. **Task (upsert)**: Ensure a `hub-01` device exists. If it doesn't, create it with type "gateway".
   ```javascript
   db.devices.updateOne(
     { id: "hub-01" },
     { 
       $setOnInsert: { 
         type: "gateway", 
         created_at: new Date() 
       } 
     },
     { upsert: true }
   )
   ```

---

## Phase 3: Array Management (`$push`, `$addToSet`, `$pull`)

Maintaining logs and tags without duplicates.

1. **Task ($push)**: Add a log entry to `thermostat-01`.
   ```javascript
   db.devices.updateOne(
     { id: "thermostat-01" }, 
     { $push: { logs: { event: "reboot", ts: new Date() } } }
   )
   ```
2. **Task ($addToSet)**: Add the tag "automated" to `bulb-01`. 
   ```javascript
   // Run this twice! The second time, nModified should be 0.
   db.devices.updateOne(
     { id: "bulb-01" }, 
     { $addToSet: { tags: "automated" } }
   )
   ```
3. **Task ($pull)**: Remove the tag "home-office" from the thermostat.
   ```javascript
   db.devices.updateOne(
     { id: "thermostat-01" }, 
     { $pull: { tags: "home-office" } }
   )
   ```

---

## Phase 4: Surgical Precision (`$`, `$[]`, `arrayFilters`)

This is the engineering high-ground.

1. **Task ($ positional)**: Update the status of the **first** component that is currently `calibrated: false` to `active: false`.
   ```javascript
   db.devices.updateOne(
     { id: "thermostat-01", "components.calibrated": false },
     { $set: { "components.$.active": false } }
   )
   ```
2. **Task ($[])**: Set **ALL** components of **ALL** devices to `active: true`.
   ```javascript
   db.devices.updateMany({}, { $set: { "components.$[].active": true } })
   ```
3. **Task (arrayFilters)**: Set `calibrated: true` ONLY for the component with `id: "temp-sensor"` inside `thermostat-01`.
   ```javascript
   db.devices.updateOne(
     { id: "thermostat-01" },
     { $set: { "components.$[c].calibrated": true } },
     { arrayFilters: [ { "c.id": "temp-sensor" } ] }
   )
   ```

---

## Phase 5: Programmatic Surgery (`driver.js`)
---

### Isolated Environments
To maintain professional standards, this lab uses two isolated databases:
*   **`smart_home`**: Used for manual practice via `mongosh`.
*   **`smart_home_test`**: Used by the automated tests and the `driver.js` script to ensure code exercises don't overwrite your manual progress.

While the shell is great for ad-hoc changes, production updates happen in code.

1. Open `driver.js`.
2. Review the implementation of atomic operators and array filters.
3. Run the script:
   ```bash
   node driver.js
   ```

## Phase 6: Validation & Cleanup

```bash
npm test
make clean
```
