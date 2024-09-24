import { HfInference } from '@huggingface/inference';
import { NextResponse } from 'next/server';

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

const animals = ['cat', 'dog', 'bird', 'fish', 'horse', 'sheep', 'cow', 'elephant', 'bear', 'zebra'];

export async function POST(request) {
  try {
    const body = await request.json();
    const { image } = body;

    if (!image) {
      return NextResponse.json({ error: 'No image data provided' }, { status: 400 });
    }

    // Remove data URL prefix if present
    const base64Image = image.split(',').pop();

    // Convert base64 to binary (Buffer)
    const buffer = Buffer.from(base64Image, 'base64');

    // Convert binary image (buffer) to Blob, as the Hugging Face model expects Blob-like input
    const blob = new Blob([buffer], { type: 'image/jpeg' }); // Change the mime type according to your image format (jpeg/png)

    // Use the CLIP model for zero-shot image classification
    const result = await hf.zeroShotImageClassification({
      model: 'openai/clip-vit-large-patch14',
      inputs: blob, // Pass the blob instead of base64 string
      candidate_labels: animals,
    });

    console.log('Classification result:', result);

    // Get the top prediction
    const topPrediction = result[0];

    if (topPrediction.score > 0.5) {
      return NextResponse.json({ animal: topPrediction.label });
    } else {
      return NextResponse.json({ animal: null });
    }
  } catch (error) {
    console.error('Error processing image:', error);
    return NextResponse.json({ error: 'Error processing image: ' + error.message }, { status: 500 });
  }
}