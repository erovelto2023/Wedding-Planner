const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017/wedding-planner';
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db('wedding-planner');
    const collection = db.collection('prompts');

    const allCategories = await collection.distinct('category');
    console.log('Categories found:', allCategories);

    let totalUpdated = 0;

    for (const category of allCategories) {
      const prompts = await collection.find({ category: category }).toArray();
      console.log(`Processing category: ${category} (${prompts.length} prompts)`);

      for (const p of prompts) {
        let promptText = p.prompt;
        
        // Skip if already optimized (contains "Task:")
        if (promptText.includes('Task:')) {
          continue;
        }

        let optimizedText = '';

        if (category === 'Speech & Toast Prompts') {
          optimizedText = `You are a professional speechwriter. I need help writing a wedding speech.

Task: ${promptText}

Context & Details to provide (replace placeholders):
- [bride/groom]: Name of the bride or groom
- [partner]: Name of the partner
- [X]: Number or specific detail

Please generate:
1. A draft of this section of the speech.
2. Delivery tips (when to pause, where to look, tone of voice).`;
        } else if (category === 'Save the Date Prompts') {
          optimizedText = `You are an expert graphic designer and image prompt engineer.

Task: Create a high-quality image generation prompt for a Save the Date card.
Style Description: ${promptText}

Please expand this into a detailed prompt for Midjourney or DALL-E, including:
1. Subject & Composition
2. Style & Medium (e.g., watercolor, line art)
3. Color Palette
4. Mood & Lighting
5. Aspect Ratio & Parameters (if Midjourney)`;
        } else {
          // Generic Template
          optimizedText = `You are a helpful wedding planning assistant.

Task: ${promptText}

Context & Details to provide (replace placeholders if applicable):
- [bride/groom]: Name of the bride or groom
- [partner]: Name of the partner
- [X]: Number or specific detail

Please generate a detailed, actionable, and organized response to help with this task.`;
        }

        await collection.updateOne(
          { _id: p._id },
          { $set: { prompt: optimizedText, updatedAt: new Date() } }
        );
        totalUpdated++;
      }
    }

    console.log(`Finished! Total prompts optimized: ${totalUpdated}`);
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
