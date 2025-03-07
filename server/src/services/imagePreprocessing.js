import sharp from 'sharp';

export async function preprocessImage(imageBuffer) {
  try {
    // Process image using sharp
    const processedBuffer = await sharp(imageBuffer)
      // Convert to grayscale
      .grayscale()
      // Increase contrast
      .normalize()
      // Remove noise
      .median(1)
      // Ensure good size for OCR
      .resize(1800, null, {
        fit: 'inside',
        withoutEnlargement: true
      })
      // Convert to png for better OCR
      .png({
        quality: 100,
        force: true
      })
      .toBuffer();

    return processedBuffer;
  } catch (error) {
    console.error('Image preprocessing error:', error);
    // Return original buffer if processing fails
    return imageBuffer;
  }
}

export async function extractReceiptArea(imageBuffer) {
  try {
    const metadata = await sharp(imageBuffer).metadata();
    
    // Basic receipt detection - focus on center area
    const width = metadata.width;
    const height = metadata.height;
    
    return await sharp(imageBuffer)
      .extract({
        left: Math.floor(width * 0.1),
        top: Math.floor(height * 0.1),
        width: Math.floor(width * 0.8),
        height: Math.floor(height * 0.8)
      })
      .toBuffer();
  } catch (error) {
    console.error('Receipt area extraction error:', error);
    return imageBuffer;
  }
}

export async function enhanceText(imageBuffer) {
  try {
    return await sharp(imageBuffer)
      .threshold(128)
      .sharpen()
      .toBuffer();
  } catch (error) {
    console.error('Text enhancement error:', error);
    return imageBuffer;
  }
}
