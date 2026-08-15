import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini AI client helper
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is missing.');
  }
  return new GoogleGenAI({ apiKey });
}

// 1. API: Environmental Analysis for Coordinates / Region
app.post('/api/gemini/eco-analysis', async (req, res) => {
  try {
    const { locationName, lat, lng, categoryData } = req.body;

    const ai = getGeminiClient();
    const prompt = `You are an expert Environmental Data Scientist & Urban Climatologist.
Perform a comprehensive environmental health assessment for the following location:
- Location Name: ${locationName || 'Specified Coordinates'}
- Latitude: ${lat}, Longitude: ${lng}
- Existing Metrics: ${JSON.stringify(categoryData || {})}

Return a valid JSON object strictly adhering to this structure:
{
  "locationName": "string",
  "ecoScore": 78, // number from 0 to 100 based on air quality, canopy, renewable energy, and risks
  "scoreBreakdown": {
    "airQuality": 80,
    "greenCanopy": 70,
    "cleanEnergy": 85,
    "wasteManagement": 75,
    "climateResilience": 80
  },
  "summary": "Concise 2-sentence expert summary of the local ecosystem health.",
  "keyEnvironmentalRisks": ["Risk 1", "Risk 2", "Risk 3"],
  "positiveEcoHighlights": ["Highlight 1", "Highlight 2"],
  "actionableRecommendations": {
    "forCitizens": ["Action 1", "Action 2", "Action 3"],
    "forCityPlanners": ["Policy 1", "Policy 2"]
  },
  "forecast30Day": "Brief 1-sentence forecast for air quality and seasonal environmental trends."
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);

    return res.json({
      ...parsed,
      coordinates: { lat, lng },
      generatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error in /api/gemini/eco-analysis:', error);
    return res.status(500).json({
      error: 'Failed to generate AI environmental analysis',
      message: error.message,
    });
  }
});

// 2. API: Green Route & Carbon Footprint Calculator
app.post('/api/gemini/green-route', async (req, res) => {
  try {
    const { origin, destination, distanceKm } = req.body;

    const ai = getGeminiClient();
    const prompt = `You are a Sustainable Mobility & Carbon Calculator Expert.
Analyze route options between:
- Origin: ${origin || 'Origin Location'}
- Destination: ${destination || 'Destination Location'}
- Estimated Distance: ${distanceKm || 12} km

Calculate realistic eco-impact metrics comparing modes of transport: Walking, Bicycling, Public Transit, EV (Electric Vehicle), Gasoline Automobile.

Return a valid JSON array of route objects with this structure:
[
  {
    "mode": "walking" | "bicycling" | "transit" | "ev" | "gas_car",
    "distanceKm": 12,
    "durationMins": 35,
    "co2EmissionsKg": 0.0,
    "co2SavedKg": 2.4, // compared to gas car
    "avgAQIAlongRoute": 35,
    "greeneryExposureScore": 85,
    "recommendation": "Optimal choice for health and zero carbon footprint."
  }
]`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '[]';
    const parsed = JSON.parse(text);

    return res.json({ routes: parsed });
  } catch (error: any) {
    console.error('Error in /api/gemini/green-route:', error);
    return res.status(500).json({
      error: 'Failed to compute green route',
      message: error.message,
    });
  }
});

// 3. API: Detailed Environmental Report Generator
app.post('/api/gemini/eco-report', async (req, res) => {
  try {
    const { region, lat, lng } = req.body;

    const ai = getGeminiClient();
    const prompt = `Write a professional Markdown Environmental Intelligence Report for region: ${region} (Lat: ${lat}, Lng: ${lng}).
Include sections:
1. Executive Environmental Summary
2. Air Quality & Particulate Inventory
3. Urban Tree Canopy & Biodiversity Assessment
4. Renewable Energy Grid Integration
5. Climate Vulnerabilities & Extreme Weather Outlook
6. Community Action Roadmap (2026-2030)`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return res.json({
      markdownReport: response.text,
      region,
      generatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error in /api/gemini/eco-report:', error);
    return res.status(500).json({
      error: 'Failed to generate environmental report',
      message: error.message,
    });
  }
});

// Serve frontend with Vite in dev, static files in prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EcoMap server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
