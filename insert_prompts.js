const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017/wedding-planner';
const client = new MongoClient(uri);

const prompts = [
  "Elegant watercolor floral wreath in soft blush and sage green, centered on a cream textured paper background, with ample negative space in the middle for 'Save the Date' typography",
  "Minimalist geometric line art of intertwined rings in gold foil texture, set against a crisp white background, with clean margins for modern sans-serif text placement",
  "Vintage botanical illustration of eucalyptus and dried lavender, arranged in a symmetrical border, antique parchment texture background, muted earth tones",
  "Moody twilight sky with soft watercolor clouds, a single golden sun peeking through, deep navy and burgundy palette, romantic composition with open center for text",
  "Modern abstract brush strokes in terracotta, ochre, and cream, layered diagonally across a matte finish background, balanced asymmetrical layout for contemporary typography",
  "Delicate pressed flower arrangement featuring ferns and baby's breath, arranged in a circular frame, soft ivory backdrop, natural lighting effect, elegant negative space",
  "Art deco-inspired geometric pattern in black and gold, symmetrical border design, luxurious high-contrast palette, central blank panel for elegant serif text",
  "Watercolor mountain landscape at sunrise, soft pastels blending into warm gold, panoramic composition, clean upper third reserved for save-the-date details",
  "Minimalist archway made of olive branches and white roses, centered on a soft gray background, subtle shadow depth, open lower half for text placement",
  "Vintage travel postcard style, faded blue and sepia tones, illustrated compass and airplane silhouette, distressed edges, classic typography-friendly center space",
  "Soft focus garden bokeh background with delicate pink peonies floating gently, dreamy romantic lighting, clean central area for elegant calligraphy-style text",
  "Modern marble texture with subtle gold veining, high-end luxury aesthetic, split composition with textured left side and smooth right side for text alignment",
  "Hand-drawn wildflower field in soft watercolor, rolling hills background, warm spring palette, top half clear for save-the-date wording, bottom half floral accent",
  "Celestial theme with watercolor moon phases, scattered tiny gold stars on deep midnight blue, ethereal glow, centered circular negative space for typography",
  "Rustic kraft paper texture background with stamped botanical illustrations in forest green and burnt orange, vintage postage stamp borders, ample center space",
  "Minimalist continuous line drawing of a couple's silhouettes holding hands, single black line on soft blush pink background, modern and clean layout for text",
  "Tropical leaf pattern featuring monstera and palm fronds in emerald and gold, repeating seamless design faded at edges, crisp white center panel for details",
  "Soft gradient ombré background transitioning from lavender to peach, subtle paper grain texture, elegant and airy composition, perfect for modern romantic typography",
  "Vintage lace overlay effect on cream cardstock, intricate floral patterns fading into transparency at center, classic heirloom aesthetic with open middle for text",
  "Abstract geometric mountain range in muted sage and slate, minimalist vector style, clean negative space sky area at top for save-the-date information",
  "Watercolor citrus fruit arrangement with lemons and olive branches, bright Mediterranean palette, fresh and sunny composition, centered blank circle for typography",
  "Moody forest scene with misty pine trees, deep green and charcoal tones, cinematic lighting, lower third clear for elegant serif save-the-date text",
  "Modern terrazzo pattern in soft pastel tones with gold speckles, contemporary design aesthetic, balanced composition with ample white space for text overlay",
  "Delicate macramé-inspired geometric border in warm taupe and cream, boho-chic aesthetic, soft natural lighting, open center panel for handwritten-style typography",
  "Vintage wax seal design with intricate floral monogram, deep red and gold tones, centered on thick cotton paper texture, classic layout with surrounding negative space",
  "Soft watercolor wash background in dusty rose and sage, blended seamlessly, ethereal and dreamy mood, clean upper quadrant reserved for elegant text placement",
  "Minimalist line art of a sun and crescent moon intertwined, black ink on warm ivory background, modern spiritual aesthetic, balanced margins for typography",
  "Lush tropical floral cluster featuring hibiscus and bird of paradise, vibrant but softened edges, white background fade, top center space for save-the-date wording",
  "Abstract marble and gold leaf combination, luxury wedding aesthetic, asymmetrical composition, smooth gradient transition leaving clean area for text",
  "Vintage botanical engraving style, detailed ferns and wildflowers, sepia and cream palette, classic scientific illustration layout with central text panel",
  "Soft focus lavender field at golden hour, dreamy purple and yellow tones, blurred foreground and background, crisp center strip for elegant typography",
  "Modern architectural line drawing of a wedding venue or archway, minimalist black on light gray, clean and contemporary, ample negative space for details",
  "Watercolor cloud and sky composition in pastel blue and white, airy and light, subtle paper texture, open lower half for modern sans-serif text placement",
  "Rustic wood grain background with subtle burnished edges, warm amber and brown tones, vintage farm aesthetic, centered blank space for classic typography",
  "Delicate paper-cut floral layering effect, 3D shadow depth, soft white and blush tones, intricate but airy composition, clean center for text overlay",
  "Modern abstract watercolor splashes in coral and navy, dynamic but balanced layout, artistic and contemporary, open middle section for save-the-date details",
  "Vintage map illustration style with faded compass roses and route lines, muted blue and parchment tones, travel-themed aesthetic, central clear area for typography",
  "Soft linen texture background with subtle crosshatch weave, natural and organic feel, warm off-white palette, clean margins for elegant modern text",
  "Watercolor eucalyptus garland draped across top edge, soft green and silver tones, cascading leaves fading down, clear center and bottom for text placement",
  "Minimalist geometric circle pattern in soft gold on charcoal background, modern luxury aesthetic, balanced negative space in center for typography",
  "Delicate pressed botanical specimen arrangement, vintage museum display style, soft sepia and cream tones, clean rectangular panel in center for details",
  "Moody stormy sky with dramatic light rays breaking through clouds, cinematic contrast, deep blue and silver palette, upper clear space for save-the-date wording",
  "Modern terracotta tile pattern inspiration, warm earth tones, geometric repeating design faded at edges, contemporary layout with open center for text",
  "Soft focus cherry blossom branches, pale pink petals floating on light breeze, springtime romance aesthetic, clean middle area for elegant typography",
  "Vintage postage stamp border design with intricate floral corners, aged paper texture, muted sage and cream palette, classic centered layout for save-the-date",
  "Abstract ink wash painting in deep emerald and black, fluid organic shapes, artistic and moody, balanced composition with clear text panel in center",
  "Minimalist line drawing of a coastal wave and seashell, single stroke on soft seafoam background, beach wedding theme, ample negative space for typography",
  "Watercolor autumn leaves in burnt orange, gold, and burgundy, scattered naturally across cream background, seasonal warmth, clear center for save-the-date text",
  "Modern metallic foil texture effect in rose gold, subtle gradient shine, luxury contemporary aesthetic, clean margins for elegant serif font placement",
  "Delicate lace doily pattern overlay on soft ivory, vintage romantic style, intricate edges fading to transparent center, classic layout for typography",
  "Soft gradient sky at twilight transitioning from peach to lavender, dreamy and ethereal, subtle cloud texture, open lower third for modern text alignment",
  "Minimalist abstract mountain silhouette in slate blue and white, clean vector style, peaceful composition, ample upper space for save-the-date wording",
  "Watercolor olive branch wreath with subtle gold accents, Mediterranean elegance, soft green and cream tones, centered negative space for elegant typography",
  "Vintage engraving of intertwined botanical vines, detailed line work on warm parchment, classic heirloom feel, clean rectangular panel for text placement",
  "Modern geometric hexagon pattern in muted mustard and gray, contemporary design aesthetic, balanced layout with open center for save-the-date details",
  "Soft focus rose garden at dawn, delicate pink and white blooms, romantic morning light, clean middle section for elegant handwritten-style typography",
  "Abstract terrazzo and concrete texture combination, industrial chic wedding theme, cool gray and white palette, balanced composition with clear text area",
  "Minimalist continuous line art of a floral crown, black ink on blush pink background, modern and delicate, ample negative space for modern sans-serif text",
  "Watercolor coastal scene with gentle waves and sandy shore, soft blue and beige tones, serene beach aesthetic, upper half reserved for save-the-date wording",
  "Vintage wax seal and ribbon motif, deep burgundy and gold tones, classic formal wedding style, centered layout with surrounding blank space for typography",
  "Soft linen weave background with subtle natural texture, warm oatmeal and cream palette, organic and earthy feel, clean margins for elegant text placement",
  "Modern abstract brush stroke composition in terracotta and sage, dynamic but balanced, contemporary artistic style, open center panel for save-the-date details",
  "Delicate paper-cut layered clouds in soft blue and white, 3D shadow effect, airy and light composition, crisp middle section for modern typography",
  "Moody forest path with dappled sunlight, deep green and golden tones, cinematic nature aesthetic, lower clear space for elegant serif save-the-date text",
  "Watercolor citrus grove with lemons and olive leaves, bright Mediterranean palette, fresh and vibrant, centered blank circle for typography overlay",
  "Minimalist geometric archway in black and gold, modern luxury design, symmetrical composition, ample negative space in center for text placement",
  "Vintage botanical field guide style, detailed ferns and wildflowers, sepia and cream tones, classic scientific layout with central panel for save-the-date",
  "Soft focus lavender and wildflower meadow, dreamy purple and yellow hues, romantic summer vibe, clean center strip for elegant typography",
  "Modern abstract marble with gold veining, high-end contemporary aesthetic, split texture layout, smooth gradient transition leaving clear area for text",
  "Delicate macramé-inspired geometric border in warm taupe, boho-chic wedding theme, soft natural lighting, open center panel for handwritten-style text",
  "Watercolor cloud and sky composition in pastel peach and blue, airy and light, subtle paper grain texture, open lower half for modern sans-serif placement",
  "Minimalist line drawing of intertwined initials, single black stroke on soft gray background, contemporary personal touch, balanced margins for typography",
  "Rustic kraft paper texture with stamped wildflowers in forest green, vintage handmade aesthetic, warm earth tones, ample center space for save-the-date wording",
  "Soft gradient ombré background from dusty rose to sage green, subtle linen texture, elegant and airy composition, perfect for modern romantic typography",
  "Vintage lace overlay on cream cardstock, intricate floral patterns fading to transparency, classic heirloom style, open middle for elegant serif text",
  "Abstract geometric mountain range in muted olive and slate, minimalist vector design, clean negative space sky area at top for save-the-date information",
  "Watercolor pressed flower arrangement featuring dried blooms and ferns, circular frame composition, soft ivory backdrop, natural lighting, elegant negative space",
  "Modern terrazzo pattern in soft pastels with copper speckles, contemporary luxury aesthetic, balanced composition with ample white space for text overlay",
  "Delicate botanical engraving of eucalyptus and lavender, detailed line work on warm parchment, vintage scientific style, clean center panel for typography",
  "Moody twilight sky with soft watercolor clouds and a single golden crescent, deep navy and burgundy palette, romantic composition with open center for text",
  "Minimalist continuous line drawing of a wedding arch, single stroke on blush background, modern and clean layout for save-the-date details",
  "Soft focus garden bokeh with delicate white peonies, dreamy romantic lighting, clean central area for elegant calligraphy-style typography placement",
  "Modern abstract brush strokes in coral and navy, dynamic but balanced layout, artistic contemporary style, open middle section for save-the-date wording",
  "Vintage travel postcard illustration with compass and airplane silhouette, faded blue and sepia tones, distressed edges, classic typography-friendly center space",
  "Watercolor mountain landscape at sunset, warm gold and soft purple blending, panoramic composition, clean upper third reserved for elegant text placement",
  "Minimalist geometric circle pattern in soft gold on charcoal, modern luxury aesthetic, balanced negative space in center for save-the-date typography",
  "Delicate pressed botanical specimen arrangement, vintage museum display style, soft sepia and cream tones, clean rectangular panel in center for details",
  "Soft gradient sky transitioning from peach to lavender, dreamy ethereal mood, subtle cloud texture, open lower third for modern sans-serif text alignment",
  "Modern terracotta tile pattern inspiration, warm earth tones, geometric repeating design faded at edges, contemporary layout with open center for typography",
  "Watercolor cherry blossom branches with pale pink petals, springtime romance aesthetic, soft morning light, clean middle area for elegant handwritten text",
  "Vintage postage stamp border design with intricate floral corners, aged paper texture, muted sage and cream palette, classic centered layout for save-the-date",
  "Abstract ink wash painting in deep emerald and black, fluid organic shapes, artistic and moody, balanced composition with clear text panel in center",
  "Minimalist line drawing of a coastal wave and seashell, single stroke on soft seafoam background, beach wedding theme, ample negative space for typography",
  "Watercolor autumn leaves scattered naturally across cream background, burnt orange and gold tones, seasonal warmth, clear center for save-the-date wording",
  "Modern metallic foil texture effect in rose gold, subtle gradient shine, luxury contemporary aesthetic, clean margins for elegant serif font placement",
  "Delicate lace doily pattern overlay on soft ivory, vintage romantic style, intricate edges fading to transparent center, classic layout for save-the-date text",
  "Soft focus rose garden at dawn, delicate pink and white blooms, romantic morning light, clean middle section for elegant handwritten-style typography",
  "Abstract terrazzo and concrete texture combination, industrial chic wedding theme, cool gray and white palette, balanced composition with clear text area",
  "Minimalist continuous line art of a floral crown, black ink on blush pink background, modern and delicate, ample negative space for modern sans-serif text",
  "Watercolor coastal scene with gentle waves and sandy shore, soft blue and beige tones, serene beach aesthetic, upper half reserved for save-the-date wording"
];

async function run() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db('wedding-planner');
    const collection = db.collection('prompts');

    let addedCount = 0;
    let skippedCount = 0;

    for (const prompt of prompts) {
      const existing = await collection.findOne({ prompt: prompt });
      if (!existing) {
        await collection.insertOne({
          category: 'Save the Date Prompts',
          prompt: prompt,
          createdAt: new Date()
        });
        addedCount++;
      } else {
        skippedCount++;
      }
    }

    console.log(`Finished! Added: ${addedCount}, Skipped (Duplicates): ${skippedCount}`);
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
