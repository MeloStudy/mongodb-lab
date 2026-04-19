# LAB-001: Hello MongoDB

Welcome to the first official syllabus laboratory! You will spin up your very own MongoDB instance and interact with it using two different paradigms: the native administrative shell (`mongosh`) and programmatic code via a driver (Node.js).

## Prerequisites
Please ensure you have read `CONCEPT.md` in this directory to understand the theoretical foundation of BSON and JavaScript-native execution.

## Phase 1: Deploying the Container (Native Orchestration)

Instead of relying on magic scripts, we use Docker Compose natively to deploy a clean, isolated environment for this specific lab.

1. Open a terminal in this directory (`/labs/001-hello-mongodb`).
2. Run the deployment command:
   ```bash
   docker-compose up -d
   ```
3. Wait a few seconds for the database to boot.

> **Command Dissection**
> - `docker-compose`: The tool that orchestrates containers based on `docker-compose.yml`.
> - `up`: Instructs Docker to build, (re)create, start, and attach the container.
> - `-d`: (Detached mode). Runs the container in the background so your terminal remains free.

## Phase 2: Scenario 1 - The Interactive Shell (mongosh)

We will execute our first query physically inside the database container.

1. "Enter" the running container and launch the MongoDB shell:
   ```bash
   docker exec -it mongodb_lab_001 mongosh
   ```

> **Command Dissection**
> - `docker exec`: Run a command in a running container.
> - `-i`: (Interactive) Keep STDIN open even if not attached.
> - `-t`: (TTY) Allocate a pseudo-TTY. This is required to draw the shell interface correctly.
> - `mongodb_lab_001`: The specific name of our container defined in the yaml file.
> - `mongosh`: The command being executed inside the container -> The MongoDB Shell interpreter.

2. Once inside `mongosh`, switch to our designated lab database:
   ```javascript
   use lab_db
   ```
   *Note: In MongoDB, "using" a non-existent database automatically creates it the moment you insert data.*

3. Insert a strictly formatted BSON/JSON document:
   ```javascript
   db.greetings.insertOne({ msg: "Hello from CLI" })
   ```

4. Exit the shell:
   ```javascript
   exit
   ```

## Phase 3: Scenario 2 - The Node.js Driver

Now that you have proven you can act as a DBA manually inserting records, it's time to act as a Developer making the application do it programmatically.

1. Install the local project dependencies (Node.js MongoDB driver + Jest for testing):
   ```bash
   npm install
   ```

2. Open the file `driver.js` inside this directory.
3. Locate the `TODO: Write connection code` comment and implement the connection:
   ```javascript
    await client.connect();
   ```

4. Locate the `TODO: Write insertion code` comment. Connect to the `lab_db` and insert your document programmatically:
   ```javascript
    const db = client.db(dbName);
    const collection = db.collection('greetings');
    await collection.insertOne({ msg: "Hello from Driver" });
   ```

5. Save the file. Run your newly programmed script:
   ```bash
   node driver.js
   ```

## Phase 4: Validation (TDD)

Let's prove you completed both scenarios. The automated test suite will verify the state of your database.

Execute:
```bash
npm test
```

If you receive a green "PASS" for both `01-shell` and `02-driver`, you have successfully mastered the basics of MongoDB connectivity!

## Phase 5: Atomic Cleanup (Idempotent Tear-down)

Since every lab is isolated, you must destroy the environment after you've learned the lesson. This prevents container clashes and frees up resources.

Run the native cleanup command:
```bash
docker-compose down -v --remove-orphans
```

> **Command Dissection**
> - `down`: Stops containers and removes containers, networks, volumes, and images created by `up`.
> - `-v`: (Volumes) Crucial flag that wipes out the persistent database volume. Without this, your data survives!
> - `--remove-orphans`: Checks for background leftover layers and removes them neatly.
