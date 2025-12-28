import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateBlurPlaceholder(imagePath: string): Promise<string> {
  try {
    const buffer = await fs.readFile(imagePath);

    // Create a tiny 10x10 thumbnail with heavy blur
    const { data, info } = await sharp(buffer)
      .resize(10, 10, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({
        quality: 20,
        effort: 0, // Faster encoding
      })
      .toBuffer({ resolveWithObject: true });

    // Convert to base64 data URL
    const base64 = `data:image/${info.format};base64,${data.toString("base64")}`;

    console.log(`✅ Generated blur placeholder for ${path.basename(imagePath)}`);
    console.log(`📊 Size: ${(base64.length / 1024).toFixed(2)}KB`);
    console.log(`📝 Blur Data URL:`);
    console.log(base64);
    console.log("\n");

    return base64;
  } catch (error) {
    console.error(`❌ Error processing ${imagePath}:`, error);
    throw error;
  }
}

async function main() {
  const imagesToProcess = [
    {
      name: "Hero Illustration",
      path: path.join(__dirname, "../public/src/modules/Public/Home/assets/illustration.webp"),
    },
    // Add more images here as needed
  ];

  for (const { name, path: imagePath } of imagesToProcess) {
    console.log(`Processing: ${name}`);
    await generateBlurPlaceholder(imagePath);
  }
}

main().catch(console.error);
