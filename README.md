# MongoDB Masterclass Laboratory

Welcome to the **MongoDB Masterclass Repository**. This project contains a comprehensive, 22-laboratory curriculum designed to take you from a basic understanding of documents to an enterprise-grade mastery of NoSQL schema design, the Aggregation Framework, Node.js/Java Integration, and High Availability distributed clusters.

## 🧠 Educational Approach

We learn through **Test-Driven Learning**.
Each laboratory contains a `CONCEPT.md` providing the essential theoretical foundation, followed by practical exercises. You must pass the automated testing suite (Node.js/Jest or Java/JUnit) to validate that you have correctly manipulated the local database.

To ensure your local computer is kept clean, we follow an **Atomic Cleanup** principle—all databases are ephemeral Docker containers that are cleanly destroyed after completing a module.

## 🗺️ Syllabus

The curriculum is structured across 8 Progressive Modules. Please consult [docs/syllabus.md](docs/syllabus.md) for the detailed, step-by-step path.

## 🚀 Getting Started

This repository operates under an **NPM Workspaces** architecture. You only need to run the installation process once at the root directory to be ready for the course.

1. **Install Global Dependencies:**
   ```bash
   npm install
   ```

2. **Run a specific Lab:**
   ```bash
   make setup LAB=000
   make test LAB=000
   make clean LAB=000
   ```

*(You can also navigate inside each lab folder and execute `./setup.sh` directly if you prefer an agnostic approach).*

Read our [Constitution](docs/constitution.md) for the internal contribution rules and agent boundaries.
