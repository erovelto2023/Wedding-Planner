const { MongoClient } = require('mongodb');

async function check() {
  const uri = 'mongodb://localhost:27017';
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('wedding-planner');
    const proposals = await db.collection('proposals').find({}).toArray();
    console.log('Proposals:', JSON.stringify(proposals, null, 2));
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

check();
