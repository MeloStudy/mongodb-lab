# Concept: MongoDB Configuration Files

In production environments, you never start MongoDB by manually passing 50 flags to a command-line interface. Instead, you use a **Declarative Configuration File**.

## The Daemon (`mongod`) vs. The Shell (`mongosh`)

Understanding the distinction between these two components is fundamental:

- **`mongod` (The Daemon)**: This is the actual database engine. It is a background process that handles data requests, manages data access, and performs background management operations. It is the "server".
- **`mongosh` (The Shell)**: This is a JavaScript interface to MongoDB. It is a client tool used to connect to a running `mongod` instance to query data, perform administrative tasks, and manage the database.

In this lab, we are configuring the **daemon** behavior using a file.

## CLI Flags vs. Configuration Files
- **CLI Flags**: Good for quick tests (e.g., `mongod --dbpath /tmp/data`). Hard to version control, easy to mistype.
- **Config Files**: Mandatory for production. Written in YAML. Can be tracked in Git, peer-reviewed, and deployed consistently.

## The Bootstrap Sequence
When `mongod` starts with the `-f` (file) or `--config` flag, it:
1. Parses the YAML structure.
2. Validates that directories like `dbPath` exist and have write permissions.
3. Locks the `mongod.lock` file to prevent other processes from touching the data.
4. Starts the networking layer on the specified port.

## Key YAML Settings
- **`systemLog`**: Controls where the engine writes its logs. Using `destination: file` is standard for DevOps, as it allows rotating logs for auditing.
- **`storage`**: The most critical configuration. It defines the `dbPath` (where data files live) and `journaling` (write-ahead log for crash recovery).

## Verifying Memory State
You can ask a running MongoDB instance exactly which flags it was started with by using the command:
```javascript
db.serverCmdLineOpts()
```
This returns a `parsed` object showing the effective configuration in memory, regardless of what the file on disk currently says.
