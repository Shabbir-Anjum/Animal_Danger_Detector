# Animal Classifier

This project uses Next.js and the CLIP model to classify animals in uploaded images, provide descriptions, and assess their potential danger to humans.

## Features

- Image upload functionality
- Animal classification using CLIP model
- Generation of animal descriptions
- Assessment of animal danger to humans
- Display of results including classification, description, and danger assessment

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env.local` file and add your Hugging Face API key:
   HUGGINGFACE_API_KEY=your_key_here
4. Run the development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Upload an image of an animal using the file input.
2. Click the "Analyze Image" button.
3. View the results, including the detected animal, description, and danger assessment.