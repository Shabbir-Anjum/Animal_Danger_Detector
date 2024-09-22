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

    // Use the CLIP model for zero-shot image classification
    const result = await hf.zeroShotImageClassification({
      model: 'openai/clip-vit-large-patch14',
      inputs: base64Image,
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