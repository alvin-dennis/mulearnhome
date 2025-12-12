import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function optimizeImage(inputPath: string, outputPath: string) {
  try {
    const stats = await fs.stat(inputPath);
    const originalSize = stats.size;

    await sharp(inputPath)
      .webp({
        quality: 85,
        effort: 6, // Higher effort = better compression
      })
      .toFile(outputPath);

    const newStats = await fs.stat(outputPath);
    const newSize = newStats.size;
    const savings = (((originalSize - newSize) / originalSize) * 100).toFixed(1);

    console.log(
      `✅ ${path.basename(inputPath)}: ${(originalSize / 1024).toFixed(1)}KB → ${(newSize / 1024).toFixed(1)}KB (${savings}% smaller)`,
    );
  } catch (error) {
    console.error(`❌ Error optimizing ${path.basename(inputPath)}:`, error);
  }
}

async function main() {
  const publicDir = path.join(__dirname, "../public");
  // Define directories to scan for images
  // Add any specific asset directories here
  const imageDirs = ["assets", "src/modules/Public/Home/assets"];

  console.log("🚀 Starting build-time image optimization...");

  for (const dir of imageDirs) {
    const fullPath = path.join(publicDir, dir);

    try {
      await fs.access(fullPath);
      const files = await fs.readdir(fullPath);

      for (const file of files) {
        if (file.match(/\.(png|jpg|jpeg)$/i)) {
          const input = path.join(fullPath, file);
          const output = path.join(fullPath, file.replace(/\.(png|jpg|jpeg)$/i, ".webp"));

          // Check if WebP version already exists and is newer
          try {
            const inputStats = await fs.stat(input);
            const outputStats = await fs.stat(output);

            if (outputStats.mtime > inputStats.mtime) {
              // file already optimized and up to date
              continue;
            }
          } catch (e) {
            // output doesn't exist, proceed
          }

          await optimizeImage(input, output);
        }
      }
    } catch (e) {
      // Directory doesn't exist, skip
      // console.log(`Skipping ${dir} (not found)`);
    }
  }

  console.log("✨ Image optimization complete!");
}

main().catch(console.error);
