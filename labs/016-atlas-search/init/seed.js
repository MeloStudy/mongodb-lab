db = db.getSiblingDB('search_db');

db.books.insertMany([
  {
    title: "MongoDB: The Definitive Guide",
    author: "Shannon Bradshaw",
    description: "Manage your data with a scalable, high-performance open-source NoSQL database.",
    genre: "Technology",
    publishedYear: 2019
  },
  {
    title: "Clean Code",
    author: "Robert C. Martin",
    description: "A handbook of agile software craftsmanship.",
    genre: "Technology",
    publishedYear: 2008
  },
  {
    title: "Design Patterns",
    author: "Erich Gamma",
    description: "Elements of reusable object-oriented software.",
    genre: "Technology",
    publishedYear: 1994
  },
  {
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt",
    description: "Your journey to mastery in software development.",
    genre: "Technology",
    publishedYear: 1999
  },
  {
    title: "Refactoring",
    author: "Martin Fowler",
    description: "Improving the design of existing code.",
    genre: "Technology",
    publishedYear: 1999
  },
  {
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    description: "A journey through the history of our species.",
    genre: "History",
    publishedYear: 2011
  },
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    description: "A story of wealth, love, and the American Dream in the 1920s.",
    genre: "Fiction",
    publishedYear: 1925
  },
  {
    title: "Don Quixote",
    author: "Miguel de Cervantes",
    description: "The adventures of a noble from La Mancha.",
    genre: "Classic",
    publishedYear: 1605
  },
  {
    title: "Database System Concepts",
    author: "Abraham Silberschatz",
    description: "A comprehensive guide to database systems.",
    genre: "Technology",
    publishedYear: 2019
  },
  {
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen",
    description: "The definitive guide to algorithms.",
    genre: "Technology",
    publishedYear: 2009
  }
]);

print("✅ Universal Library dataset seeded successfully in search_db.");
