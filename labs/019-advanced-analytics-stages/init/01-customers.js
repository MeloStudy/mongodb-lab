db = db.getSiblingDB('lab_db');

db.customers.insertMany([
  { _id: 1, name: "Alice", email: "alice@example.com", joined: new Date('2023-01-01') },
  { _id: 2, name: "Bob", email: "bob@example.com", joined: new Date('2023-02-15') },
  { _id: 3, name: "Charlie", email: "charlie@example.com", joined: new Date('2023-03-10') },
  { _id: 4, name: "Diana", email: "diana@example.com", joined: new Date('2023-04-05') },
  { _id: 5, name: "Edward", email: "edward@example.com", joined: new Date('2023-05-20') }
]);

print('Seeded customers.');
