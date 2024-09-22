import OpenAI from "openai";

const apiKey = process.env.UPSTAGE_API_KEY
const openai = new OpenAI({
  apiKey: apiKey,
  baseURL: 'https://api.upstage.ai/v1/solar'
})
export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { animal } = req.body;

      const prompt = `
        Animal: ${animal}
        
        Task: Provide a brief description of the animal and determine if it's generally considered dangerous to humans.
        
        Format your response as JSON with the following structure:
        {
          "description": "Brief description of the animal",
          "isDangerous": true/false,
          "reason": "Explanation for why the animal is or isn't considered dangerous"
        }
      `;
      
      const completion = await openai.chat.completions.create({
        model: 'solar-pro',
        messages: [{ role: "user", content: prompt }],
      });
      console.log(completion,'from model')
      const result = JSON.parse(completion.data.choices[0].message.content);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: 'Error analyzing animal' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}