export interface EvaluatedMetricResult {
  metricKey: string;
  predictedValue: number;
  lowerBound: number;
  upperBound: number;
  confidenceLevel: 'Low' | 'Moderate' | 'High';
  samplingUncertainty: number;
  calibrationUncertainty: number;
}

export interface ViewPredictionRange {
  worstCaseViews: number;
  mostLikelyViews: number;
  bestCaseViews: number;
  formattedRange: string;
  confidenceBandPct: number;
}

export class ConfidenceEngine {
  /**
   * Compute weighted statistical rollup and confidence interval
   */
  public static calculateMetricRollup(
    metricKey: string,
    probabilities: number[],
    weights: number[],
    calibrationError: number = 0.03
  ): EvaluatedMetricResult {
    const K = probabilities.length;
    if (K === 0) {
      return {
        metricKey,
        predictedValue: 0,
        lowerBound: 0,
        upperBound: 0,
        confidenceLevel: 'Low',
        samplingUncertainty: 0.1,
        calibrationUncertainty: calibrationError
      };
    }

    // Normalized weights check
    const totalWeight = weights.reduce((acc, w) => acc + w, 0) || 1;
    const normWeights = weights.map(w => w / totalWeight);

    // Weighted mean
    let weightedMean = 0;
    for (let i = 0; i < K; i++) {
      weightedMean += normWeights[i] * probabilities[i];
    }

    // Weighted variance
    let weightedVariance = 0;
    for (let i = 0; i < K; i++) {
      const diff = probabilities[i] - weightedMean;
      weightedVariance += normWeights[i] * (diff * diff);
    }

    const stdDev = Math.sqrt(weightedVariance);
    // 95% Confidence interval sampling error: z * (stdDev / sqrt(K))
    const zScore = 1.96;
    const samplingUncertainty = (zScore * stdDev) / Math.sqrt(K);

    const totalMargin = samplingUncertainty + calibrationError;
    const lowerBound = Math.max(0, Number((weightedMean - totalMargin).toFixed(4)));
    const upperBound = Math.min(1, Number((weightedMean + totalMargin).toFixed(4)));

    let confidenceLevel: 'Low' | 'Moderate' | 'High' = 'Moderate';
    if (totalMargin < 0.05 && K >= 500) {
      confidenceLevel = 'High';
    } else if (totalMargin > 0.12 || K < 50) {
      confidenceLevel = 'Low';
    }

    return {
      metricKey,
      predictedValue: Number(weightedMean.toFixed(4)),
      lowerBound,
      upperBound,
      confidenceLevel,
      samplingUncertainty: Number(samplingUncertainty.toFixed(4)),
      calibrationUncertainty: Number(calibrationError.toFixed(4))
    };
  }

  /**
   * Derive probabilistic view distribution range
   */
  public static calculateViewPredictionRange(
    scrollStopProb: number,
    watch3sProb: number,
    completionProb: number,
    shareProb: number,
    confidenceLevel: 'Low' | 'Moderate' | 'High'
  ): ViewPredictionRange {
    // Base potential reach multiplier driven by engagement signal strength
    const viralVelocityFactor = (scrollStopProb * 0.3) + (watch3sProb * 0.3) + (completionProb * 0.25) + (shareProb * 0.15);

    let baseMultiplier = 15000;
    if (viralVelocityFactor > 0.75) {
      baseMultiplier = 250000;
    } else if (viralVelocityFactor > 0.55) {
      baseMultiplier = 65000;
    } else if (viralVelocityFactor > 0.40) {
      baseMultiplier = 25000;
    }

    const expected = Math.round(baseMultiplier * Math.pow(viralVelocityFactor, 1.8));

    // Variance spread depending on confidence level
    const spreadPct = confidenceLevel === 'High' ? 0.35 : confidenceLevel === 'Moderate' ? 0.55 : 0.85;

    const worstCase = Math.max(1200, Math.round(expected * (1 - spreadPct)));
    const bestCase = Math.round(expected * (1 + spreadPct * 1.5));

    const formatNum = (num: number): string => {
      if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
      if (num >= 1000) return `${Math.round(num / 1000)}K`;
      return `${num}`;
    };

    return {
      worstCaseViews: worstCase,
      mostLikelyViews: expected,
      bestCaseViews: bestCase,
      formattedRange: `${formatNum(worstCase)}–${formatNum(bestCase)}`,
      confidenceBandPct: Math.round((1 - spreadPct) * 100)
    };
  }
}
