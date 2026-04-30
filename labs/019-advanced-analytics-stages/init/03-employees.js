db = db.getSiblingDB('lab_db');

db.employees.insertMany([
  { _id: 1, name: "CEO", reportsTo: null },
  { _id: 2, name: "VP Engineering", reportsTo: 1 },
  { _id: 3, name: "VP Sales", reportsTo: 1 },
  { _id: 4, name: "Director Engineering", reportsTo: 2 },
  { _id: 5, name: "Engineering Manager", reportsTo: 4 },
  { _id: 6, name: "Lead Developer", reportsTo: 5 },
  { _id: 7, name: "Developer A", reportsTo: 6 },
  { _id: 8, name: "Developer B", reportsTo: 6 },
  { _id: 9, name: "Sales Manager", reportsTo: 3 },
  { _id: 10, name: "Sales Rep", reportsTo: 9 }
]);

print('Seeded employees org chart.');
