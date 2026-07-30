export interface GpuNode {
  gpuId: string;
  totalVramMb: number;
  usedVramMb: number;
  activeTasks: number;
}

export class GpuScheduler {
  private nodes: GpuNode[] = [
    { gpuId: 'gpu-0', totalVramMb: 81920, usedVramMb: 24500, activeTasks: 4 },
    { gpuId: 'gpu-1', totalVramMb: 81920, usedVramMb: 18200, activeTasks: 2 },
    { gpuId: 'gpu-2', totalVramMb: 81920, usedVramMb: 31000, activeTasks: 5 },
    { gpuId: 'gpu-3', totalVramMb: 81920, usedVramMb: 12000, activeTasks: 1 }
  ];

  public allocateNode(): GpuNode {
    // Allocate to GPU node with lowest active VRAM utilization
    return [...this.nodes].sort((a, b) => a.usedVramMb - b.usedVramMb)[0];
  }

  public getNodes(): GpuNode[] {
    return [...this.nodes];
  }
}
