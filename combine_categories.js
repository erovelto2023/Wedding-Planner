const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017/wedding-planner';
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db('wedding-planner');
    const collection = db.collection('prompts');

    // Combine Problem-Solving Prompts -> Problem Solver Prompts
    const probResult = await collection.updateMany(
      { category: 'Problem-Solving Prompts' },
      { $set: { category: 'Problem Solver Prompts' } }
    );
    console.log(`Updated ${probResult.modifiedCount} documents to 'Problem Solver Prompts'`);

    // Combine Speeches & Toasts Prompts -> Speech & Toast Prompts
    const speechResult = await collection.updateMany(
      { category: 'Speeches & Toasts Prompts' },
      { $set: { category: 'Speech & Toast Prompts' } }
    );
    console.log(`Updated ${speechResult.modifiedCount} documents to 'Speech & Toast Prompts'`);

    const allCategories = await collection.distinct('category');
    console.log('Current categories in database:', allCategories);

  } finally {
    await client.close();
  }
}

run().catch(console.dir);
