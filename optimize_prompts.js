const { MongoClient, ObjectId } = require('mongodb');

const uri = 'mongodb://localhost:27017/wedding-planner';
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db('wedding-planner');
    const collection = db.collection('prompts');

    // Fetch prompts from 'Speech & Toast Prompts'
    const prompts = await collection.find({ category: 'Speech & Toast Prompts' }).toArray();
    console.log(`Found ${prompts.length} prompts to optimize.`);

    let updatedCount = 0;

    for (const p of prompts) {
      let promptText = p.prompt;
      
      // Basic optimization: Make it multi-line and add structure
      // Example: "Help me write an opening line that immediately captures the emotion of this moment by describing exactly where I was and what I felt when I first learned [bride/groom] was getting married"
      
      let optimizedText = promptText;
      
      if (promptText.startsWith('Help me') || promptText.startsWith('Guide me') || promptText.startsWith('Craft a') || promptText.startsWith('Write a')) {
        // Extract the main action
        const firstLine = promptText.split(',')[0]; // Simple split
        
        optimizedText = `Role: You are a professional speechwriter helping me write a wedding speech.
Task: ${promptText}

Instructions:
- Maintain a warm, emotional, and authentic tone.
- Fill in the bracketed variables like [bride/groom], [partner], [X] with appropriate details.
- Provide 2-3 variations (e.g., emotional, lighthearted, storytelling) if applicable.

Output Format:
- Direct speech content that I can say.
- Any delivery notes (e.g., [pause for laughter], [look at partner]).`;
      }

      // This is a bit generic, let's make it better by parsing the prompt if possible
      // But for a bulk update, adding structure is a good first step!
      
      // Let's try a more specific transformation for "Speech & Toast Prompts"
      let customOptimized = `You are a professional speechwriter. I need help writing a wedding speech.

Task: ${promptText}

Context & Details to provide (replace placeholders):
- [bride/groom]: Name of the bride or groom
- [partner]: Name of the partner
- [X]: Number or specific detail

Please generate:
1. A draft of this section of the speech.
2. Delivery tips (when to pause, where to look, tone of voice).`;

      await collection.updateOne(
        { _id: p._id },
        { $set: { prompt: customOptimized, updatedAt: new Date() } }
      );
      updatedCount++;
    }

    console.log(`Finished! Updated: ${updatedCount} prompts.`);
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
