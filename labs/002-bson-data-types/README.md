# LAB-002: BSON & Data Types

Welcome to Lab 002. It's time to act like an engineering professional and construct data perfectly without primitive rounding flaws.

## Phase 1: Deploying the Container

As always, deploy the isolated environment explicitly for this lab.

1. Open a terminal in this directory (`/labs/002-bson-data-types`).
2. Run the deployment command:
   ```bash
   docker-compose up -d
   ```

## Phase 2: Scenario 1 - The Interactive Shell (`mongosh`)

You're going to insert a highly-specified "invoice" document directly into the database. By default, `mongosh` uses native JS numbers (`Double`). You will override this by using `mongosh` BSON wrappers.

1. Connect to the shell:
   ```bash
   docker exec -it mongodb_lab_002 mongosh
   ```
2. Navigate to the local database:
   ```javascript
   use bson_db
   ```
3. Insert the document deliberately wrapping your parameters:
   ```javascript
   db.invoices.insertOne({
       source: "CLI",
       price: NumberDecimal("100.99"),
       sizeInBytes: NumberInt(4096),
       internalFile: BinData(0, "YmFzZTY0c2FtcGxl") 
   })
   ```
   *Note: `BinData(0, ...)` explicitly identifies this string as base64 raw binary via the subtype `0`.*

4. **Verify the server understood your types:** 
   Let's run a query to ask the database to *only* return documents where the `price` field was saved explicitly as a 128-bit Decimal, not a double float.
   ```javascript
   db.invoices.find({ price: { $type: "decimal" } })
   ```

> **Command Dissection (`$type`)**
> - `$type`: An operator that selects documents where the specific field has the designated BSON type.
> - `"decimal"`: The string alias representing `Decimal128`.
> - `"int"`: The string alias representing a 32-bit integer.
> - `"binData"`: The string alias representing raw Binary components.

5. Exit `mongosh` (`exit`).

## Phase 3: Scenario 2 - The Node.js Driver

It's time to build the exact same entity, but using a Javascript application backend.

1. Ensure the driver is installed (handled by our workspace, but good to remember).
   ```bash
   npm install
   ```
2. Open `driver.js` in your IDE.
3. Observe `Step 1`. Connect to the database the same way you did in Lab 001.
4. **Step 2**: This is where you invoke the Node.js equivalents of those BSON wrappers. Import `{ Decimal128, Int32, Binary }` from the `mongodb` package line at the top.
5. Create your variables explicitly using standard syntax:
   ```javascript
    const explicitPrice = new Decimal128("100.99");
    const explicitSize = new Int32(4096);
    const explicitBinary = new Binary(Buffer.from("YmFzZTY0c2FtcGxl", "base64"), 0);
   ```
6. **Step 3**: Insert them into the collection. Make sure you include `{ source: "Driver" }` as part of the document so the tests distinguish it from the CLI!
7. Save the script.
8. Execute the script to safely encode the data into the database:
   ```bash
   node driver.js
   ```

## Phase 4: Validation (TDD)

Execute our strict testing suite. Our engine will explicitly query the underlying database via `$type` to ensure you successfully overrode native JavaScript types and generated secure BSON structure.

```bash
npm test
```

## Phase 5: Atomic Cleanup

Destroy the active workspace.
```bash
docker-compose down -v --remove-orphans
```
