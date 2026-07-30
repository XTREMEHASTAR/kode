export interface BenchmarkVideoItem {
  id: string;
  title: string;
  niche: 'SAAS' | 'TECH' | 'FITNESS' | 'COMEDY' | 'EDUCATION' | 'FASHION' | 'GAMING' | 'FINANCE' | 'TRAVEL' | 'FOOD';
  durationSec: number;
  expectedHookScore: number;
}

export class BenchmarkDataset {
  private dataset: BenchmarkVideoItem[] = [];

  constructor() {
    this.generate100VideoDataset();
  }

  public getDataset(): BenchmarkVideoItem[] {
    return [...this.dataset];
  }

  private generate100VideoDataset(): void {
    const niches: BenchmarkVideoItem['niche'][] = [
      'SAAS', 'TECH', 'FITNESS', 'COMEDY', 'EDUCATION',
      'FASHION', 'GAMING', 'FINANCE', 'TRAVEL', 'FOOD'
    ];

    for (let i = 1; i <= 100; i++) {
      const niche = niches[(i - 1) % niches.length];
      const durationSec = 15 + ((i * 7) % 45);
      const expectedHookScore = Number((0.70 + ((i * 3) % 25) / 100).toFixed(2));

      this.dataset.push({
        id: `bench_video_${i.toString().padStart(3, '0')}`,
        title: `${niche} Benchmark Video #${i}`,
        niche,
        durationSec,
        expectedHookScore
      });
    }
  }
}
