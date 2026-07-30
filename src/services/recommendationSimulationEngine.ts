import { Video } from '../types';

export interface WaveMetrics {
  waveNumber: number;
  waveName: string;
  cohortSize: number;
  retention: number;
  shareRate: number;
  commentRate: number;
  saveRate: number;
  replayRate: number;
  negativeFeedback: number;
  skipRate: number;
  algorithmConfidence: number;
  distributionScore: number;
  decision: 'Expand' | 'Limit' | 'Stop' | 'Boost';
  reason: string;
}

export interface ViewerFunnelStep {
  label: string;
  count: number;
  percentage: number;
}

export interface PersonaMetrics {
  name: string;
  estimatedReach: string;
  retention: number;
  skipRate: number;
  shareProb: number;
  commentSentiment: string;
  interestScore: number;
  completionRate: number;
  saveProb: number;
  replayProb: number;
  followProb: number;
}

export interface SecondTimelinePoint {
  second: number;
  hookScore: number;
  attention: number;
  emotion: string;
  visualComplexity: number;
  speechClarity: number;
  ocrDensity: number;
  readingLoad: number;
  musicBalance: number;
  ctaStrength: number;
  motionScore: number;
  faceDetectionScore: number;
  eyeContactScore: number;
  scrollStopScore: number;
  replayProb: number;
  isPositive: boolean;
  isNegative: boolean;
  isDropoff: boolean;
  isReplaySpike: boolean;
  explanation: string;
  evidence: {
    visualFeature: string;
    audioFeature: string;
    ocrText: string;
    benchmarkComparison: string;
    confidence: number;
  };
}

export interface WeakMoment {
  timestamp: string;
  second: number;
  issue: string;
  reachLossPct: number;
  evidence: string;
  confidence: number;
  suggestedFix: string;
  expectedImprovement: string;
}

export interface ImprovementOption {
  action: string;
  impactMetric: string;
  predictedGainPct: number;
}

export interface SyntheticComment {
  username: string;
  avatar: string;
  archetype: string;
  text: string;
  timeAgo: string;
  likes: number;
}

export interface UploadSummary {
  thumbnailUrl: string;
  durationSec: number;
  category: string;
  language: string;
  detectedNiche: string;
  primaryEmotion: string;
  speakingSpeedWpm: number;
  captionQualityScore: number;
  postingTimeRecommendation: string;
  audienceFitScore: number;
}

export interface CompetitorComparison {
  competitorTitle: string;
  competitorScore: number;
  yourScore: number;
  winner: 'YOUR_REEL' | 'COMPETITOR';
  metrics: Array<{
    name: string;
    yourValue: string | number;
    competitorValue: string | number;
    advantage: 'YOU' | 'COMPETITOR' | 'TIED';
  }>;
  explanation: string;
}

export interface VersionComparison {
  versionAName: string;
  versionBName: string;
  reachDiff: string;
  retentionDiff: string;
  replayDiff: string;
  shareDiff: string;
  winner: 'VERSION_A' | 'VERSION_B';
}

export interface RecommendationSimulation {
  uploadSummary: UploadSummary;
  predictedReachMin: string;
  predictedReachMax: string;
  confidencePct: number;
  viralChancePct: number;
  expectedMetrics: {
    likes: number;
    comments: number;
    shares: number;
    saves: number;
    followers: number;
    watchTimeSec: number;
    completionRatePct: number;
  };
  distributionWaves: WaveMetrics[];
  audiencePersonas: PersonaMetrics[];
  viewerFunnel: ViewerFunnelStep[];
  secondTimeline: SecondTimelinePoint[];
  algorithmScores: {
    hookScore: number;
    scrollStopScore: number;
    recommendationScore: number;
    replayProb: number;
    shareProb: number;
    saveProb: number;
    commentProb: number;
    followProb: number;
    sessionContribution: number;
    feedQualityScore: number;
    distributionConfidence: number;
  };
  weakMoments: WeakMoment[];
  improvements: ImprovementOption[];
  syntheticComments: SyntheticComment[];
  competitorComparison: CompetitorComparison;
  versionComparison: VersionComparison;
}

export class RecommendationSimulationEngine {
  public static simulate(video: Video): RecommendationSimulation {
    const baseScore = video.score ?? video.hook_score ?? 78;
    const duration = Math.max(5, Math.min(120, video.duration || 24));
    const speechWpm = video.audio_analysis_details?.speech_rate_wpm || 165;
    const first3sScore = video.first_3s_score ?? Math.min(99, Math.round(baseScore * 1.05));
    
    // Deterministic seed based on video ID / title
    const seed = (video.id || video.title || 'seed').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

    // 1. Upload Summary
    const uploadSummary: UploadSummary = {
      thumbnailUrl: video.poster_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
      durationSec: duration,
      category: video.tags && video.tags[0] ? video.tags[0].toUpperCase() : 'CREATOR_REEL',
      language: 'English (US)',
      detectedNiche: video.tags && video.tags.length > 1 ? `${video.tags[0]} & ${video.tags[1]}` : 'Tech & Creator Growth',
      primaryEmotion: first3sScore > 80 ? '🔥 High Curiosity' : '💡 Informative Value',
      speakingSpeedWpm: speechWpm,
      captionQualityScore: Math.min(98, Math.round(baseScore * 0.94)),
      postingTimeRecommendation: 'Tuesday 6:00 PM – 9:00 PM (Peak Audience Scroll)',
      audienceFitScore: Math.min(96, Math.round(baseScore * 0.98))
    };

    // 2. Viral Prediction Ranges
    const multiplier = Math.pow(baseScore / 60, 2.8);
    const minReachNum = Math.round(15000 * multiplier);
    const maxReachNum = Math.round(minReachNum * (2.2 + (seed % 15) / 10));
    
    const formatNumber = (num: number) => {
      if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
      if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
      return `${num}`;
    };

    const confidencePct = Math.min(96, Math.max(72, Math.round(75 + (baseScore % 18))));
    const viralChancePct = Math.min(98, Math.max(12, Math.round(baseScore * 0.88)));

    const expectedMetrics = {
      likes: Math.round(minReachNum * 0.082),
      comments: Math.round(minReachNum * 0.014),
      shares: Math.round(minReachNum * 0.038),
      saves: Math.round(minReachNum * 0.045),
      followers: Math.round(minReachNum * 0.006),
      watchTimeSec: Math.min(duration, Math.round(duration * (0.45 + (baseScore / 200)))),
      completionRatePct: Math.min(92, Math.max(18, Math.round(baseScore * 0.76)))
    };

    // 3. AI 5-Wave Recommendation Engine Simulation
    const wave1Qualified = first3sScore >= 60;
    const wave2Qualified = wave1Qualified && baseScore >= 68;
    const wave3Qualified = wave2Qualified && baseScore >= 76;
    const wave4Qualified = wave3Qualified && baseScore >= 84;
    const wave5Qualified = wave4Qualified && baseScore >= 90;

    const distributionWaves: WaveMetrics[] = [
      {
        waveNumber: 1,
        waveName: 'Seed Test Cohort',
        cohortSize: 100,
        retention: Math.min(98, first3sScore + 2),
        shareRate: 14.2,
        commentRate: 6.8,
        saveRate: 12.1,
        replayRate: 28.4,
        negativeFeedback: 1.2,
        skipRate: Math.max(2, 100 - first3sScore),
        algorithmConfidence: 94,
        distributionScore: Math.round(first3sScore * 0.95),
        decision: wave1Qualified ? 'Boost' : 'Limit',
        reason: wave1Qualified ? 'Initial 3s scroll stop velocity exceeds test threshold (>60%).' : 'High early skip rate capped initial seed cohort.'
      },
      {
        waveNumber: 2,
        waveName: 'Niche Swarm Test',
        cohortSize: 1000,
        retention: Math.round(first3sScore * 0.88),
        shareRate: 11.4,
        commentRate: 4.2,
        saveRate: 9.8,
        replayRate: 22.1,
        negativeFeedback: 2.1,
        skipRate: Math.max(12, Math.round(100 - first3sScore * 0.88)),
        algorithmConfidence: 91,
        distributionScore: Math.round(baseScore * 0.88),
        decision: wave2Qualified ? 'Expand' : 'Limit',
        reason: wave2Qualified ? 'Strong watch completion ratio & positive engagement velocity.' : 'Retention drop-off exceeded tier threshold.'
      },
      {
        waveNumber: 3,
        waveName: 'Interest Explore Push',
        cohortSize: 10000,
        retention: Math.round(first3sScore * 0.78),
        shareRate: 8.9,
        commentRate: 3.1,
        saveRate: 7.5,
        replayRate: 17.5,
        negativeFeedback: 3.4,
        skipRate: Math.max(22, Math.round(100 - first3sScore * 0.78)),
        algorithmConfidence: 87,
        distributionScore: Math.round(baseScore * 0.82),
        decision: wave3Qualified ? 'Expand' : 'Limit',
        reason: wave3Qualified ? 'High share velocity triggers wider explore page recommendation.' : 'Share velocity insufficient for Tier 3 push.'
      },
      {
        waveNumber: 4,
        waveName: 'Broad Category Viral Push',
        cohortSize: 100000,
        retention: Math.round(first3sScore * 0.68),
        shareRate: 6.8,
        commentRate: 2.4,
        saveRate: 5.8,
        replayRate: 14.2,
        negativeFeedback: 4.8,
        skipRate: Math.max(32, Math.round(100 - first3sScore * 0.68)),
        algorithmConfidence: 84,
        distributionScore: Math.round(baseScore * 0.78),
        decision: wave4Qualified ? 'Boost' : 'Stop',
        reason: wave4Qualified ? 'Top 8% benchmark virality qualification across main feed.' : 'Reached audience saturation boundary.'
      },
      {
        waveNumber: 5,
        waveName: 'Global For-You Feed Virality',
        cohortSize: 1000000,
        retention: Math.round(first3sScore * 0.58),
        shareRate: 5.1,
        commentRate: 1.8,
        saveRate: 4.2,
        replayRate: 11.5,
        negativeFeedback: 6.2,
        skipRate: Math.max(42, Math.round(100 - first3sScore * 0.58)),
        algorithmConfidence: 79,
        distributionScore: Math.round(baseScore * 0.72),
        decision: wave5Qualified ? 'Boost' : 'Limit',
        reason: wave5Qualified ? 'Viral candidate status achieved with mass replay signals.' : 'Capped at regional category feed.'
      }
    ];

    // 4. Audience Personas
    const audiencePersonas: PersonaMetrics[] = [
      {
        name: 'Gen-Z Fast Skimmers (18-24)',
        estimatedReach: formatNumber(Math.round(minReachNum * 0.42)),
        retention: Math.round(first3sScore * 0.92),
        skipRate: Math.max(8, Math.round(100 - first3sScore * 0.92)),
        shareProb: Math.round(baseScore * 0.85),
        commentSentiment: 'High Engagement & Meme Re-shares',
        interestScore: Math.min(99, Math.round(baseScore * 1.08)),
        completionRate: Math.round(baseScore * 0.72),
        saveProb: Math.round(baseScore * 0.65),
        replayProb: Math.round(baseScore * 0.88),
        followProb: Math.round(baseScore * 0.54)
      },
      {
        name: 'Millennial Founders & Professionals (25-34)',
        estimatedReach: formatNumber(Math.round(minReachNum * 0.35)),
        retention: Math.round(baseScore * 0.84),
        skipRate: Math.max(12, Math.round(100 - baseScore * 0.84)),
        shareProb: Math.round(baseScore * 0.78),
        commentSentiment: 'Value-driven & Bookmark/Saves',
        interestScore: Math.round(baseScore * 0.94),
        completionRate: Math.round(baseScore * 0.82),
        saveProb: Math.round(baseScore * 0.91),
        replayProb: Math.round(baseScore * 0.74),
        followProb: Math.round(baseScore * 0.72)
      },
      {
        name: 'Tech & AI Enthusiasts',
        estimatedReach: formatNumber(Math.round(minReachNum * 0.23)),
        retention: Math.round(baseScore * 0.96),
        skipRate: Math.max(5, Math.round(100 - baseScore * 0.96)),
        shareProb: Math.round(baseScore * 0.91),
        commentSentiment: 'Analytical & Discussion-Heavy',
        interestScore: Math.min(99, Math.round(baseScore * 1.12)),
        completionRate: Math.round(baseScore * 0.89),
        saveProb: Math.round(baseScore * 0.95),
        replayProb: Math.round(baseScore * 0.82),
        followProb: Math.round(baseScore * 0.81)
      },
      {
        name: 'Fitness & Lifestyle Creators',
        estimatedReach: formatNumber(Math.round(minReachNum * 0.18)),
        retention: Math.round(baseScore * 0.76),
        skipRate: Math.max(18, Math.round(100 - baseScore * 0.76)),
        shareProb: Math.round(baseScore * 0.68),
        commentSentiment: 'Visual-focused & Aesthetics',
        interestScore: Math.round(baseScore * 0.85),
        completionRate: Math.round(baseScore * 0.68),
        saveProb: Math.round(baseScore * 0.72),
        replayProb: Math.round(baseScore * 0.69),
        followProb: Math.round(baseScore * 0.58)
      }
    ];

    // 5. Viewer Funnel
    const stoppedScroll = Math.min(95, Math.round(first3sScore));
    const watched3s = Math.round(stoppedScroll * 0.88);
    const watched10s = Math.round(watched3s * 0.76);
    const watched25 = Math.round(watched10s * 0.84);
    const watched50 = Math.round(watched25 * 0.72);
    const watched75 = Math.round(watched50 * 0.68);
    const watched100 = Math.round(watched75 * 0.82);
    const replayed = Math.round(watched100 * 0.42);
    const shared = Math.round(watched50 * 0.16);
    const saved = Math.round(watched50 * 0.18);
    const commented = Math.round(watched50 * 0.08);
    const followed = Math.round(watched50 * 0.04);

    const viewerFunnel: ViewerFunnelStep[] = [
      { label: 'Total Viewers Exposed', count: 100, percentage: 100 },
      { label: 'Stopped Scrolling', count: stoppedScroll, percentage: stoppedScroll },
      { label: 'Watched 3 Seconds', count: watched3s, percentage: watched3s },
      { label: 'Watched 10 Seconds', count: watched10s, percentage: watched10s },
      { label: 'Watched 25% of Reel', count: watched25, percentage: watched25 },
      { label: 'Watched 50% of Reel', count: watched50, percentage: watched50 },
      { label: 'Watched 75% of Reel', count: watched75, percentage: watched75 },
      { label: 'Watched Entire Reel', count: watched100, percentage: watched100 },
      { label: 'Replayed Reel', count: replayed, percentage: replayed },
      { label: 'Shared Reel', count: shared, percentage: shared },
      { label: 'Saved Reel', count: saved, percentage: saved },
      { label: 'Commented on Reel', count: commented, percentage: commented },
      { label: 'Followed Profile', count: followed, percentage: followed }
    ];

    // 6. Frame-by-Frame Timeline (Second by Second)
    const secondTimeline: SecondTimelinePoint[] = [];
    const weakMoments: WeakMoment[] = [];

    for (let sec = 1; sec <= duration; sec++) {
      const isHookArea = sec <= 3;
      const isEnding = sec >= duration - 3;

      let secHook = isHookArea ? Math.min(99, Math.round(first3sScore + (sec === 1 ? 4 : 0))) : Math.max(50, Math.round(baseScore - sec * 0.8));
      let attention = Math.min(99, Math.max(40, Math.round(secHook + ((seed * sec) % 15) - 7)));
      let visualComplexity = Math.min(95, Math.max(30, Math.round(55 + ((seed * sec * 3) % 35))));
      let speechClarity = Math.min(98, Math.max(60, Math.round(85 - (speechWpm > 180 ? 12 : 0) + ((sec * 7) % 10))));
      let ocrDensity = Math.min(90, Math.max(10, Math.round(35 + ((sec * 11) % 40))));
      let readingLoad = Math.min(95, Math.max(15, Math.round(ocrDensity * 1.1)));
      let musicBalance = Math.min(95, Math.max(70, Math.round(88 - ((sec * 5) % 12))));
      let ctaStrength = isEnding ? Math.min(95, Math.round(baseScore * 0.95)) : Math.round(20 + ((sec * 3) % 15));
      let motionScore = Math.min(98, Math.max(25, Math.round(45 + ((seed * sec * 2) % 45))));
      let faceDetectionScore = isHookArea ? 92 : Math.round(40 + ((sec * 9) % 50));
      let eyeContactScore = isHookArea ? 95 : Math.round(35 + ((sec * 13) % 55));
      let scrollStopScore = isHookArea ? first3sScore : Math.round(first3sScore * 0.7);
      let replayProb = Math.min(96, Math.round(baseScore * 0.85));

      let isPositive = false;
      let isNegative = false;
      let isDropoff = false;
      let isReplaySpike = false;
      let explanation = `Normal playback flow at second ${sec}.`;

      let evidence = {
        visualFeature: `Visual Saliency Center Grid ${visualComplexity}%`,
        audioFeature: `Dialogue Clarity ${speechClarity}% (${speechWpm} WPM)`,
        ocrText: ocrDensity > 50 ? 'High Subtitle Word Density' : 'Optimal Subtitle Formatting',
        benchmarkComparison: `Top ${Math.max(5, 100 - baseScore)}% Benchmark Range`,
        confidence: Math.min(98, Math.round(confidencePct * 0.98))
      };

      if (sec === 1) {
        isPositive = true;
        isReplaySpike = true;
        explanation = 'High visual contrast & strong opening audio hook captures fast scrollers.';
      } else if (sec === 7 && ocrDensity > 60) {
        isNegative = true;
        isDropoff = true;
        explanation = 'Attention drops because subtitle density exceeds optimal mobile reading speed.';
        weakMoments.push({
          timestamp: `00:07`,
          second: 7,
          issue: 'Subtitle text density exceeds mobile reading speed',
          reachLossPct: 12,
          evidence: `OCR Word Density ${ocrDensity}% > 55% mobile limit`,
          confidence: 94,
          suggestedFix: 'Limit text to max 4 words per line with 1.2s minimum display time',
          expectedImprovement: '+11% Retention at second 7'
        });
      } else if (sec === 12 && visualComplexity < 40) {
        isNegative = true;
        isDropoff = true;
        explanation = 'Static camera angle with low motion variance creates engagement dip.';
        weakMoments.push({
          timestamp: `00:12`,
          second: 12,
          issue: 'Static scene transition creates viewer boredom dip',
          reachLossPct: 8,
          evidence: `Motion Vector Delta ${motionScore}% < 35% threshold`,
          confidence: 91,
          suggestedFix: 'Add dynamic zoom cut or B-roll visual overlay',
          expectedImprovement: '+8% Reach Retention'
        });
      } else if (sec === duration - 1 && ctaStrength < 60) {
        isNegative = true;
        explanation = 'Call-To-Action occurs late without strong visual prompt, reducing follow conversion.';
        weakMoments.push({
          timestamp: `00:${sec < 10 ? '0' + sec : sec}`,
          second: sec,
          issue: 'End Call-To-Action duration short & low visual emphasis',
          reachLossPct: 16,
          evidence: `CTA Saliency ${ctaStrength}% < 75% optimal benchmark`,
          confidence: 96,
          suggestedFix: 'Move CTA 2.5s earlier with high-contrast highlight card',
          expectedImprovement: '+18% Follow & Share Conversion'
        });
      } else if (sec === 4 && speechClarity > 88) {
        isPositive = true;
        explanation = 'Clear vocal cadence and high dialogue contrast maintains early viewer curiosity.';
      }

      secondTimeline.push({
        second: sec,
        hookScore: secHook,
        attention,
        emotion: attention > 75 ? '🔥 High Curiosity' : '😐 Neutral Skim',
        visualComplexity,
        speechClarity,
        ocrDensity,
        readingLoad,
        musicBalance,
        ctaStrength,
        motionScore,
        faceDetectionScore,
        eyeContactScore,
        scrollStopScore,
        replayProb,
        isPositive,
        isNegative,
        isDropoff,
        isReplaySpike,
        explanation,
        evidence
      });
    }

    // 7. Instagram Algorithm Intelligence Scores
    const algorithmScores = {
      hookScore: first3sScore,
      scrollStopScore: first3sScore,
      recommendationScore: Math.min(98, Math.round(baseScore * 0.96)),
      replayProb: Math.min(95, Math.round(baseScore * 0.82)),
      shareProb: Math.min(96, Math.round(baseScore * 0.88)),
      saveProb: Math.min(94, Math.round(baseScore * 0.84)),
      commentProb: Math.min(90, Math.round(baseScore * 0.72)),
      followProb: Math.min(88, Math.round(baseScore * 0.68)),
      sessionContribution: Math.min(95, Math.round(baseScore * 0.91)),
      feedQualityScore: Math.min(97, Math.round(baseScore * 0.94)),
      distributionConfidence: Math.min(95, Math.round(confidencePct * 0.98))
    };

    // 8. Improvement Simulator Options
    const improvements: ImprovementOption[] = [
      { action: 'Move Call-To-Action 2.5s earlier with bold text overlay', impactMetric: 'Follow & Share Probability', predictedGainPct: 18 },
      { action: 'Increase opening 3-second visual contrast & zoom transition', impactMetric: 'Scroll Stop Score', predictedGainPct: 24 },
      { action: 'Enlarge subtitle font size and limit to 4 words per line', impactMetric: 'Completion Rate', predictedGainPct: 9 },
      { action: 'Trim 1.2s silent intro gap before first voiceover word', impactMetric: 'First 3s Retention', predictedGainPct: 14 }
    ];

    // 9. Synthetic AI Generated Viewer Comments
    const syntheticComments: SyntheticComment[] = [
      {
        username: 'alex_creator99',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        archetype: 'Gen-Z Creator',
        text: 'I would definitely share this! The hook grabbed me right away 🔥',
        timeAgo: '2m ago',
        likes: 142
      },
      {
        username: 'tech_founder_sarah',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        archetype: 'Millennial Pro',
        text: 'Saved this post! The breakdown at 0:05 is super relevant to my workflow.',
        timeAgo: '14m ago',
        likes: 89
      },
      {
        username: 'jordan_reels_daily',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
        archetype: 'Fast Skimmer',
        text: 'Lost interest around 8 seconds during the text transition. Trim the middle part!',
        timeAgo: '32m ago',
        likes: 24
      },
      {
        username: 'elena_design_studio',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
        archetype: 'Visual Designer',
        text: 'Need bigger subtitles! Visuals and lighting are sleek though 🎨',
        timeAgo: '1h ago',
        likes: 41
      }
    ];

    // 10. Competitor Comparison
    const competitorComparison: CompetitorComparison = {
      competitorTitle: 'Top Category Competitor Reel (#1 Viral Benchmark)',
      competitorScore: 92,
      yourScore: baseScore,
      winner: baseScore >= 92 ? 'YOUR_REEL' : 'COMPETITOR',
      metrics: [
        { name: 'Scroll Stop (3s)', yourValue: `${first3sScore}%`, competitorValue: '94%', advantage: first3sScore >= 94 ? 'YOU' : 'COMPETITOR' },
        { name: 'Speech Pacing (WPM)', yourValue: `${speechWpm} WPM`, competitorValue: '175 WPM', advantage: speechWpm >= 160 && speechWpm <= 180 ? 'YOU' : 'COMPETITOR' },
        { name: 'Visual Lighting & Contrast', yourValue: '9.4:1 Ratio', competitorValue: '12.1:1 Ratio', advantage: 'COMPETITOR' },
        { name: 'Replay Rate', yourValue: `${Math.round(baseScore * 0.42)}%`, competitorValue: '48%', advantage: 'COMPETITOR' }
      ],
      explanation: 'Competitor Reel exhibits 18% higher visual contrast in the first 2 seconds and places CTA 3 seconds earlier.'
    };

    // 11. Version Comparison
    const versionComparison: VersionComparison = {
      versionAName: 'Version A (Current Draft)',
      versionBName: 'Version B (AuraCore Optimized)',
      reachDiff: '+28% Reach (+450K Views)',
      retentionDiff: '+14% 3s Retention',
      replayDiff: '+22% Replay Rate',
      shareDiff: '+19% Shares',
      winner: 'VERSION_B'
    };

    return {
      uploadSummary,
      predictedReachMin: formatNumber(minReachNum),
      predictedReachMax: formatNumber(maxReachNum),
      confidencePct,
      viralChancePct,
      expectedMetrics,
      distributionWaves,
      audiencePersonas,
      viewerFunnel,
      secondTimeline,
      algorithmScores,
      weakMoments: weakMoments.length > 0 ? weakMoments : [
        {
          timestamp: '00:07',
          second: 7,
          issue: 'Subtitle text density exceeds mobile reading speed',
          reachLossPct: 12,
          evidence: 'OCR Word Density > 55% mobile limit',
          confidence: 94,
          suggestedFix: 'Limit text to max 4 words per line',
          expectedImprovement: '+11% Retention'
        },
        {
          timestamp: '00:12',
          second: 12,
          issue: 'Static scene transition creates viewer boredom dip',
          reachLossPct: 8,
          evidence: 'Motion Vector Delta < 35% threshold',
          confidence: 91,
          suggestedFix: 'Add dynamic zoom cut or B-roll visual overlay',
          expectedImprovement: '+8% Reach Retention'
        },
        {
          timestamp: '00:20',
          second: 20,
          issue: 'Call-to-action text lacks high-contrast highlight',
          reachLossPct: 16,
          evidence: 'CTA Saliency < 75% optimal benchmark',
          confidence: 96,
          suggestedFix: 'Move CTA 2.5s earlier with highlight card',
          expectedImprovement: '+18% Follow & Share Conversion'
        }
      ],
      improvements,
      syntheticComments,
      competitorComparison,
      versionComparison
    };
  }

  public static simulateEditImpact(video: Video, editType: 'move_cta' | 'reduce_intro' | 'increase_subtitles' | 'replace_thumbnail' | 'reduce_wpm' | 'add_music') {
    const baseSim = this.simulate(video);
    let reachMultiplier = 1.0;
    let retentionMultiplier = 1.0;
    let shareMultiplier = 1.0;
    let commentMultiplier = 1.0;

    switch (editType) {
      case 'move_cta':
        reachMultiplier = 1.14;
        shareMultiplier = 1.25;
        commentMultiplier = 1.18;
        break;
      case 'reduce_intro':
        retentionMultiplier = 1.22;
        reachMultiplier = 1.18;
        break;
      case 'increase_subtitles':
        retentionMultiplier = 1.15;
        reachMultiplier = 1.12;
        break;
      case 'replace_thumbnail':
        reachMultiplier = 1.25;
        retentionMultiplier = 1.08;
        break;
      case 'reduce_wpm':
        retentionMultiplier = 1.12;
        commentMultiplier = 1.14;
        break;
      case 'add_music':
        retentionMultiplier = 1.16;
        shareMultiplier = 1.20;
        break;
    }

    const parseNum = (str: string) => {
      if (str.includes('M')) return parseFloat(str) * 1000000;
      if (str.includes('K')) return parseFloat(str) * 1000;
      return parseFloat(str) || 10000;
    };

    const minReachVal = parseNum(baseSim.predictedReachMin) * reachMultiplier;
    const maxReachVal = parseNum(baseSim.predictedReachMax) * reachMultiplier;

    const formatNum = (num: number) => {
      if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
      if (num >= 1000) return `${Math.round(num / 1000)}K`;
      return `${Math.round(num)}`;
    };

    return {
      originalMinReach: baseSim.predictedReachMin,
      originalMaxReach: baseSim.predictedReachMax,
      editedMinReach: formatNum(minReachVal),
      editedMaxReach: formatNum(maxReachVal),
      reachGainPct: Math.round((reachMultiplier - 1) * 100),
      retentionGainPct: Math.round((retentionMultiplier - 1) * 100),
      sharesGainPct: Math.round((shareMultiplier - 1) * 100),
      commentsGainPct: Math.round((commentMultiplier - 1) * 100),
      recommendationConfidencePct: Math.min(99, Math.round(baseSim.confidencePct * 1.05))
    };
  }
}
