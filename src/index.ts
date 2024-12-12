import { mkdir, opendir } from "fs/promises";
import sharp from "sharp";
import { IMAGE_FORMATS } from "./constants";

const createDirectoryIfNotExists = async (directory: string) => {
  return opendir('./out')
    .catch(async (error) => {
      if (error.code === 'ENOENT') {
        console.info('Creating output directory');
        await mkdir('./out');
        return opendir('./out');
      }
      throw error;
    }
    )
}

type GenerateImage = {
  format?: (typeof IMAGE_FORMATS)[keyof typeof IMAGE_FORMATS];
}
const generateImage = async (args?: GenerateImage) => {
  await createDirectoryIfNotExists('./out').catch(console.error);

  const baseRectangle = Buffer.from(
    '<svg><rect x="0" y="0" width="200" height="200" fill="white" /><rect x="60" y="60" width="80" height="80" fill="#a9a9a9" /></svg>'
  );

  const format = args?.format ?? IMAGE_FORMATS.JPEG;
  const outputLocation = `./out/output.${format}`;

  console.info(`Generating image with format: ${format}`);
  const baseImage = await sharp(baseRectangle)
    .resize(200, 200)
    .composite([
      {
        input: baseRectangle,
        blend: 'over',
      },
    ])

  const image = await baseImage
    .toFormat(format)
    .toFile(outputLocation);

  console.info(`Image generated to: ${outputLocation}`);

  return image;
}

// generateImage({ format: IMAGE_FORMATS.JPEG }).catch(console.error);
