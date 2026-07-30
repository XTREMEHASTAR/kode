export interface GpuNodeMemory {
  gpuId: string;
  totalVramMb: number;
  usedVramMb: number;
  freeVramMb: number;
  activeTaskCount: number;
}

export class GpuMemoryMonitor {
  private nodes: GpuNodeMemory[] = [
    { gpuId: 'gpu-0', totalVramMb: 81920, usedVramMb: 24500, freeVramMb: 57420, activeTaskCount: 3 },
    { gpuId: 'gpu-1', totalVramMb: 81920, usedVramMb: 18200, freeVramMb: 63720, activeTaskCount: 2 },
    { gpuId: 'gpu-2', totalVramMb: 81920, usedVramMb: 31000, freeVramMb: 50920, activeTaskCount: 4 },
    { gpuId: 'gpu-3', totalVramMb: 81920, usedVramMb: 12000, freeVramMb: 69920, activeTaskCount: 1 }
  ];

  public allocateLeastLoadedGpu(): GpuNodeMemory {
    return [...this.nodes].sort((a, b) => a.usedVramMb - b.usedVramMb)[0];
  }

  public getGpuNodes(): GpuNodeMemory[] {
    return [...this.nodes];
  }
}
