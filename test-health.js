const dotenv = require('dotenv');
dotenv.config();

const aiConfig = {
  ollamaBaseUrl: process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434',
  ollamaModel: process.env.OLLAMA_MODEL || 'qwen2.5:1.5b'
};

async function checkOllamaHealth(baseUrl, modelName, timeoutMs = 3000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${baseUrl}/api/tags`, { signal: controller.signal });
    clearTimeout(id);
    if (!res.ok) {
      return { status: 'OLLAMA_UNAVAILABLE', error: `Tags endpoint returned status ${res.status}` };
    }
    const data = await res.json();
    if (!data.models || !Array.isArray(data.models)) {
      return { status: 'OLLAMA_INVALID_RESPONSE', error: 'Invalid tags response format' };
    }
    const hasModel = data.models.some(m => {
      const n1 = m.name.toLowerCase();
      const n2 = modelName.toLowerCase();
      return n1 === n2 || n1.startsWith(n2) || n2.startsWith(n1);
    });
    if (!hasModel) {
      const foundNames = data.models.map(m => m.name);
      return { status: 'OLLAMA_MODEL_NOT_FOUND', error: `Configured model '${modelName}' not found. Available models: ${foundNames.join(', ')}` };
    }
    return { status: 'HEALTHY' };
  } catch (err) {
    clearTimeout(id);
    if (err.name === 'AbortError') {
      return { status: 'OLLAMA_TIMEOUT', error: 'Connection to Ollama timed out' };
    }
    return { status: 'OLLAMA_UNAVAILABLE', error: err.message };
  }
}

async function run() {
  console.log('Testing connection to:', aiConfig.ollamaBaseUrl);
  console.log('Target model:', aiConfig.ollamaModel);
  const result = await checkOllamaHealth(aiConfig.ollamaBaseUrl, aiConfig.ollamaModel);
  console.log('Result:', JSON.stringify(result, null, 2));
}

run();
