const { execSync } = require('child_process');
const path = require('path');

describe('LAB-005: Projection Optimization', () => {
  test('SC002: Should verify that projections exclude forbidden fields', () => {
    const driverPath = path.join(__dirname, '..', 'driver.js');
    
    let output;
    try {
      // The driver.js should log the found document to console
      output = execSync(`node ${driverPath}`).toString();
    } catch (e) {
      throw new Error(`driver.js failed: ${e.message}`);
    }

    // We search for the result in the console output
    // The student is instructed to project OUT '_id' and 'internal_cost'
    expect(output).toContain('"product":');
    expect(output).not.toContain('"_id":');
    expect(output).not.toContain('"internal_cost":');
    
    console.log('✅ Verified: Sensitive fields excluded from output via projection.');
  });
});
