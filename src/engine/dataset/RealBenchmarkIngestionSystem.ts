export type PlatformType = 'YOUTUBE_SHORTS' | 'TIKTOK' | 'INSTAGRAM_REELS';

export interface GroundTruthProvenance {
  isSimulated: boolean;
  isHardcoded: boolean;
  isEstimated: boolean;
  isFormulaDerived: boolean;
  apiEndpoint: string;
  verificationTimestamp: string;
}

export interface RealBenchmarkSampleInput {
  videoId: string;
  platform: PlatformType;
  sourceUrl: string;
  uploadDate: string;
  creatorId: string;
  actualViews: number;
  actualLikes: number;
  actualComments: number;
  actualShares: number;
  durationSec: number;
  resolution: string;
  category: string;
  localVideoPath?: string;
  provenance: GroundTruthProvenance;
}

export interface VerifiedBenchmarkEntry {
  sample: RealBenchmarkSampleInput;
  verificationStatus: 'VERIFIED' | 'REJECTED';
  rejectionReason?: string;
  contentDna?: any;
  predictionResult?: any;
}

export class RealBenchmarkIngestionSystem {
  private verifiedEntries: VerifiedBenchmarkEntry[] = [];
  private rejectedEntries: VerifiedBenchmarkEntry[] = [];

  public validateAndIngestSample(input: RealBenchmarkSampleInput): VerifiedBenchmarkEntry {
    const rejectionReasons: string[] = [];

    // 1. Check for prohibition flags
    if (input.provenance.isSimulated) rejectionReasons.push('Sample engagement is simulated');
    if (input.provenance.isHardcoded) rejectionReasons.push('Sample engagement is hardcoded');
    if (input.provenance.isEstimated) rejectionReasons.push('Sample engagement is estimated');
    if (input.provenance.isFormulaDerived) rejectionReasons.push('Sample engagement is formula-derived');

    // 2. Check for missing required platform attributes
    if (!input.sourceUrl || !input.sourceUrl.startsWith('http')) rejectionReasons.push('Missing or invalid public source URL');
    if (!input.videoId) rejectionReasons.push('Missing video ID');
    if (!input.uploadDate) rejectionReasons.push('Missing upload date');
    if (typeof input.actualViews !== 'number' || input.actualViews < 0) rejectionReasons.push('Invalid actual views count');
    if (typeof input.actualLikes !== 'number' || input.actualLikes < 0) rejectionReasons.push('Invalid actual likes count');

    if (rejectionReasons.length > 0) {
      const rejectedEntry: VerifiedBenchmarkEntry = {
        sample: input,
        verificationStatus: 'REJECTED',
        rejectionReason: rejectionReasons.join('; ')
      };
      this.rejectedEntries.push(rejectedEntry);
      return rejectedEntry;
    }

    const verifiedEntry: VerifiedBenchmarkEntry = {
      sample: input,
      verificationStatus: 'VERIFIED'
    };
    this.verifiedEntries.push(verifiedEntry);
    return verifiedEntry;
  }

  public getVerifiedEntries(): VerifiedBenchmarkEntry[] {
    return this.verifiedEntries;
  }

  public getRejectedEntries(): VerifiedBenchmarkEntry[] {
    return this.rejectedEntries;
  }

  public calculateDatasetQualityScore(): number {
    const total = this.verifiedEntries.length + this.rejectedEntries.length;
    if (total === 0) return 0;
    return Number(((this.verifiedEntries.length / total) * 100).toFixed(1));
  }
}
