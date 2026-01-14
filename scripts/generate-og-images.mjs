import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, '../public');

// Background color from theme (dark purple)
const BACKGROUND_COLOR = '#0d0a1d';
const OG_WIDTH = 1200;
const OG_HEIGHT = 630;
const ICON_SIZE = 400; // Size to display the icon at

async function createOGImage(outputName) {
  // Create dark background
  const background = await sharp({
    create: {
      width: OG_WIDTH,
      height: OG_HEIGHT,
      channels: 4,
      background: BACKGROUND_COLOR
    }
  }).png().toBuffer();

  // Resize icon to fit nicely in OG dimensions
  const iconResized = await sharp(path.join(publicDir, 'logo.png'))
    .resize(ICON_SIZE, ICON_SIZE)
    .toBuffer();

  // Calculate center position
  const left = Math.round((OG_WIDTH - ICON_SIZE) / 2);
  const top = Math.round((OG_HEIGHT - ICON_SIZE) / 2);

  // Composite icon onto background
  await sharp(background)
    .composite([
      {
        input: iconResized,
        left,
        top
      }
    ])
    .toFile(path.join(publicDir, outputName));

  console.log(`Created ${outputName}`);
}

async function main() {
  try {
    // Create all OG images with the same design
    await createOGImage('og-image.png');
    await createOGImage('og-pricing.png');
    await createOGImage('og-about.png');
    await createOGImage('og-faq.png');
    await createOGImage('twitter-image.png');

    console.log('All OG images created successfully!');
  } catch (error) {
    console.error('Error creating OG images:', error);
    process.exit(1);
  }
}

main();
