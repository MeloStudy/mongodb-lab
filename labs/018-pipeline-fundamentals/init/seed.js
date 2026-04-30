// Seed script for Lab 018: Pipeline Fundamentals
// Note: In mongosh, Decimal128 is available globally. No require needed.

print('Generating 100 sales records...');

const categories = ['Electronics', 'Home', 'Office', 'Kitchen'];
const products = {
  'Electronics': ['Laptop', 'Mouse', 'Keyboard', 'Monitor'],
  'Home': ['Lamp', 'Rug', 'Clock', 'Frame'],
  'Office': ['Desk', 'Chair', 'Pen', 'Notebook'],
  'Kitchen': ['Toaster', 'Knife', 'Bowl', 'Plate']
};
const tagsPool = ['sale', 'premium', 'new', 'imported', 'eco-friendly'];

const docs = [];

for (let i = 1; i <= 100; i++) {
  const category = categories[Math.floor(Math.random() * categories.length)];
  const product = products[category][Math.floor(Math.random() * products[category].length)];
  
  // Create a few refunds (negative quantity/price)
  const isRefund = i % 20 === 0;
  const quantity = isRefund ? -1 : Math.floor(Math.random() * 5) + 1;
  const price = 10 + Math.floor(Math.random() * 100);
  
  // Create a document with empty tags for unwind test
  let tags = [];
  if (i % 15 !== 0) {
    const numTags = Math.floor(Math.random() * 3) + 1;
    for (let j = 0; j < numTags; j++) {
      tags.push(tagsPool[Math.floor(Math.random() * tagsPool.length)]);
    }
  }

  docs.push({
    orderId: `ORD-${i.toString().padStart(4, '0')}`,
    productName: product,
    category: category,
    price: NumberDecimal(price.toString()),
    quantity: quantity,
    tags: tags,
    date: new Date(Date.now() - Math.floor(Math.random() * 1000000000))
  });
}

db.sales.insertMany(docs);
print('Seeding complete. Total documents: ' + db.sales.countDocuments());
