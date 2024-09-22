'use client'

import { useState } from 'react';

export default function Home() {
  const [image, setImage] = useState(null);
  const [createObjectURL, setCreateObjectURL] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  const uploadToClient = (event) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];
      setImage(i);
      setCreateObjectURL(URL.createObjectURL(i));
    }
  };

  const uploadToServer = async (event) => {
    event.preventDefault();
    if (!image) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result.split(',')[1];
      
      try {
        // Classify the animal
        const classifyRes = await fetch('/api/classify-animal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64Image }),
        });

        if (!classifyRes.ok) {
          const errorText = await classifyRes.text();
          throw new Error(`HTTP error! status: ${classifyRes.status}, message: ${errorText}`);
        }

        const classifyData = await classifyRes.json();

        if (classifyData.animal) {
          // Analyze the animal
          const analyzeRes = await fetch('/api/analyze-animal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ animal: classifyData.animal }),
          });

          if (!analyzeRes.ok) {
            throw new Error(`HTTP error! status: ${analyzeRes.status}`);
          }

          const analyzeData = await analyzeRes.json();
          setAnalysis(analyzeData);
        } else {
          setAnalysis({ error: 'No animal detected in the image.' });
        }
      } catch (error) {
        console.error('Error:', error);
        setAnalysis({ error: 'An error occurred while processing the image: ' + error.message });
      }
    };
    reader.readAsDataURL(image);
  };

  return (
    <div>
      <h1>Upload an Animal Image</h1>
      <form onSubmit={uploadToServer}>
        <input type="file" onChange={uploadToClient} accept="image/*" />
        <button type="submit">Upload and Analyze</button>
      </form>
      {createObjectURL && (
        <img src={createObjectURL} alt="Uploaded animal" width="300" />
      )}
      {analysis && (
        <div>
          <h2>Analysis Result</h2>
          {analysis.error ? (
            <p>{analysis.error}</p>
          ) : (
            <>
              <p>Detected Animal: {analysis.animal}</p>
              <p>{analysis.description}</p>
              <p>Is it dangerous? {analysis.isDangerous ? 'Yes' : 'No'}</p>
              <p>Reason: {analysis.reason}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}