db = db.getSiblingDB('lab_db');

db.discounts.insertMany([
  { minSpent: 0, maxSpent: 50, label: "Bronze" },
  { minSpent: 51, maxSpent: 100, label: "Silver" },
  { minSpent: 101, maxSpent: 500, label: "Gold" },
  { minSpent: 501, maxSpent: 10000, label: "Platinum" }
]);

print('Seeded discounts for uncorrelated subquery test.');
