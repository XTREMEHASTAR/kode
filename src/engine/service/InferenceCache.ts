export class InferenceCache {
  private cache: Map<string, any> = new Map();
  private maxItems: number;

  constructor(maxItems: number = 1000) {
    this.maxItems = maxItems;
  }

  public get(key: string): any | undefined {
    return this.cache.get(key);
  }

  public set(key: string, value: any): void {
    if (this.cache.size >= this.maxItems) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }

  public clear(): void {
    this.cache.clear();
  }
}
