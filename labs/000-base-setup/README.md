# LAB-000: Infrastructure Base Setup

This folder acts as the master template for all MongoDB labs moving forward. It ensures a 100% reproducible, testable, and cleanable NO-SQL environment.

## 🚀 How to Use This Template

Whenever you are starting a new lab (e.g. `LAB-001`), simply copy the contents of this folder into your new lab directory.

### 1. Setup the Environment
```bash
docker-compose up -d
```
> **What it does:** Starts the ephemeral MongoDB 7.0 container in the background.

#### 🔍 Command Dissection: `docker-compose up`
- `up`: Builds, (re)creates, starts, and attaches to containers for a service.
- `-d` (Detached mode): Runs containers in the background and leaves them running.

### 2. Run the Validation Tests
```bash
npm test
```
> **What it does:** Executes the Jest suite (`validator.test.js`) natively to ensure your connection to the database works and code behaves as expected.

### 3. Teardown & Clean (Crucial)
```bash
docker-compose down -v --remove-orphans
```
> **What it does:** Tears down the Docker containers and networks natively, returning your environment to absolute zero. Embodying our **Atomic Cleanup** constitution.

#### 🔍 Command Dissection: `docker-compose down`
- `down`: Stops containers and removes containers, networks, volumes, and images created by `up`.
- `-v`: Removes named volumes declared in the `volumes` section of the Compose file and anonymous volumes attached to containers.
- `--remove-orphans`: Removes containers for services not defined in the Compose file.

### ⚡ Optional: Automated Shortcuts
If you prefer, you can use the localized `Makefile` wrapper for convenience once you understand the native commands:
```bash
make setup
make test
make clean
```

## 📝 Configuration Modifications

- **`docker-compose.yml`**: Auth is intentionally disabled to make local testing frictionless. If a lab requires auth, map an `init.js` script containing user creation logic inside the `./init/` folder.
- **`package.json`**: Make sure to add any additional packages you might need, though the standard Node MongoDB driver and Jest should be enough for 90% of the course.
