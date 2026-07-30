const dotenv = require('dotenv');
dotenv.config();

const aiConfig = {
  ollamaBaseUrl: process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434',
  ollamaModel: process.env.OLLAMA_MODEL || 'qwen2.5:1.5b',
  timeoutMs: 180000
};

// Copy functions from server.js for validation testing
function extractAndParseJSON(text) {
  if (typeof text !== 'string') return null;
  let cleanText = text.trim();
  cleanText = cleanText.replace(/^```json\s*/i, '');
  cleanText = cleanText.replace(/^```\s*/, '');
  cleanText = cleanText.replace(/```$/, '');
  cleanText = cleanText.trim();

  const firstBrace = cleanText.indexOf('{');
  const lastBrace = cleanText.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleanText = cleanText.substring(firstBrace, lastBrace + 1);
  }

  try {
    return JSON.parse(cleanText);
  } catch (err) {
    let repaired = cleanText
      .replace(/,\s*([}\]])/g, '$1') // remove trailing commas
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, ""); // remove control characters
    try {
      return JSON.parse(repaired);
    } catch (err2) {
      return null;
    }
  }
}

function validateHookResponse(data) {
  if (!data || typeof data !== 'object') {
    console.log('Validation failed: not an object');
    return false;
  }
  if (!data.recommendedHook || typeof data.recommendedHook !== 'object') {
    console.log('Validation failed: recommendedHook is missing or not an object');
    return false;
  }
  if (typeof data.recommendedHook.text !== 'string' || !data.recommendedHook.text) {
    console.log('Validation failed: recommendedHook.text is missing or not a string');
    return false;
  }
  if (typeof data.recommendedHook.strategy !== 'string') {
    console.log('Validation failed: recommendedHook.strategy is not a string');
    return false;
  }
  if (typeof data.recommendedHook.reason !== 'string') {
    console.log('Validation failed: recommendedHook.reason is not a string');
    return false;
  }
  if (!Array.isArray(data.recommendedHook.changes)) {
    console.log('Validation failed: recommendedHook.changes is not an array');
    return false;
  }
  if (!Array.isArray(data.alternatives)) {
    console.log('Validation failed: alternatives is not an array');
    return false;
  }
  return true;
}

async function run() {
  const systemPrompt = `You are KONTAGI AI Hook Optimization Engine.
Analyze the script hook and generate an optimized hook, along with alternative hook variations based on modern high-retention social strategies.
IMPORTANT: Respect the original input language (Hindi, Hinglish, English, or any other). Do NOT force translation. Return the optimized hooks in the exact same language/dialect as the input.
Return the response in the specified JSON schema format.
Required JSON format:
{
  "recommendedHook": {
    "text": "string (the recommended improved hook)",
    "strategy": "string (e.g. Curiosity Gap)",
    "reason": "string (explanation)",
    "changes": ["string", "string"]
  },
  "alternatives": [
    {
      "text": "string (alternative hook)",
      "strategy": "string",
      "reason": "string"
    }
  ]
}`;

  const userPrompt = `Script: "KONTAGI is the ultimate AI video hook engine. It lets you analyze hooks in seconds. The software costs Rs. 499 per month. 90% of creators use it."
Content Type: "shorts"
Original Hook: "KONTAGI is the ultimate AI video hook engine."
Desired Tone: "bold"
Target Audience: "creators"
Campaign Goal: "views"`;

  console.log('Sending request to Ollama...');
  try {
    const res = await fetch(`${aiConfig.ollamaBaseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: aiConfig.ollamaModel,
        system: systemPrompt,
        prompt: userPrompt,
        stream: false,
        format: 'json',
        options: {
          temperature: 0.2
        }
      })
    });
    
    const data = await res.json();
    console.log('--- Raw Response Text ---');
    console.log(data.response);
    console.log('-------------------------');
    
    const parsed = extractAndParseJSON(data.response);
    console.log('Parsed JSON:', JSON.stringify(parsed, null, 2));
    
    console.log('Validating response...');
    const isValid = validateHookResponse(parsed);
    console.log('Is valid:', isValid);
  } catch (err) {
    console.error('Error:', err);
  }
}

run();
