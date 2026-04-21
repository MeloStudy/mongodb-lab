# LAB-003: DevOps Wrap-up: Shell & Server Config

Welcome to the DevOps finale! In this lab, you will move from simple command-line arguments to managing a professional-grade MongoDB configuration file (`mongod.conf`).

## Phase 1: Deploying with Custom Overrides

In this lab, our `docker-compose.yml` has been modified to ignore the default MongoDB startup and instead read a configuration file from `/etc/mongod.conf`.

1. Open `mongod.conf` in this directory and observe the structure.
2. Deploy the environment:
   ```bash
   docker-compose up -d
   ```

### 🔍 Understanding the Configuration (`mongod.conf`)

Unlike passing flags to a binary, the YAML configuration allows for structured management:

- **`systemLog`**:
    - `destination: file`: Instructs MongoDB to send all log output to a file instead of `stdout`.
    - `path`: The absolute path inside the container where the log file is created.
    - `logAppend: true`: Ensures that when the server restarts, it adds new logs to the end of the existing file instead of overwriting it.
- **`storage`**:
    - `dbPath`: The directory where MongoDB stores its data files (BSON files, indices, etc.).
- **`net`**:
    - `port`: The internal port the daemon listens on (Default: 27017).
    - `bindIp: 0.0.0.0`: Instructs MongoDB to listen on all available network interfaces, which is necessary for container communication.

> **Warning**: MongoDB will fail to start if the paths defined in `mongod.conf` do not exist or have wrong permissions inside the container. We have pre-mapped these volumes in `docker-compose.yml` for you.

## Phase 2: Verifying with the Shell (`mongosh`)

Once the container is up, let's verify that the engine actually loaded your config file.

1. Connect to the shell:
   ```bash
   docker exec -it mongodb_lab_003 mongosh
   ```
2. Run the administrative command to check startup options:
   ```javascript
   db.serverCmdLineOpts()
   ```

#### 🔍 Command Dissection: `db.serverCmdLineOpts()`
- `getCmdLineOpts`: The internal database command that returns the options used to start the process.
- `parsed`: The section of the output that shows the effectively applied settings from your `mongod.conf` file.

3. Verify that `storage.dbPath` in the output matches `/data/db`.

## Phase 3: Validation (TDD)

Run the automated validation suite. This test will connect to the `admin` database and verify the server's memory state.

```bash
npm test
```

## Phase 4: Atomic Cleanup

Destroy the environment and the data volume:
```bash
docker-compose down -v --remove-orphans
```
