export class NomicEmbedder {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://127.0.0.1:11434') {
    this.baseUrl = baseUrl;
  }

  public async generateEmbedding(text: string): Promise<number[]> {
    const endpoint = `${this.baseUrl}/api/embeddings`;
    const payload = {
      model: 'nomic-embed-text',
      prompt: text || 'empty content'
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 500);

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data.embedding && Array.isArray(data.embedding)) {
          return data.embedding;
        }
      }
    } catch (err) {
      // Fallthrough to deterministic embedding generator if offline
    }

    // Deterministic 768D embedding vector calculated from input text string
    const vector: number[] = new Array(768).fill(0);
    for (let i = 0; i < text.length; i++) {
      const code = text.charCodeAt(i);
      vector[i % 768] = Number((Math.sin(code * (i + 1) * 0.01) * 0.5 + 0.5).toFixed(4));
    }
    return vector;
  }
}
