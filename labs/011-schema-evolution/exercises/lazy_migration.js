/**
 * Scenario 1: Lazy Migration (Application Logic)
 * 
 * Your task is to implement a function that takes a 'user' object 
 * from the legacy schema (V1) and returns the updated object (V2).
 * 
 * V1 Schema: { name: "First Last", ... }
 * V2 Schema: { first_name: "First", last_name: "Last", schema_version: 2, ... }
 */

function migrateUser(user) {
  // 1. Split user.name
  const names = user.name.split(" ");

  // 2. Set first_name and last_name
  const firstName = names[0];
  const lastName = names.slice(1).join(" ");

  // 3. Set schema_version to 2
  const updatedUser = { ...user, first_name: firstName, last_name: lastName, schema_version: 2 };

  // 4. Remove the 'name' property
  delete updatedUser.name;

  return updatedUser;
}

module.exports = migrateUser;