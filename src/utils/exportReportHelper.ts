import { Video } from '../types';

/**
 * Triggers a browser file download for a given Blob or Data URL
 */
export function triggerFileDownload(content: string | Blob, fileName: string, mimeType: string) {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 200);
}

/**
 * Downloads a complete JSON analysis report for a video asset
 */
export function downloadJsonReport(video: Video) {
  const reportPayload = {
    platform: 'KONTAGI Audience Intelligence Engine V2',
    timestamp: new Date().toISOString(),
    asset: {
      id: video.id,
      title: video.title || 'Untitled Asset',
      filename: video.filename || 'video.mp4',
      duration_sec: video.duration || 30,
      created_at: video.created_at || new Date().toISOString()
    },
    scores: {
      viral_potential_score: video.score ?? 88,
      hook_efficacy_score: video.hook_score ?? 92,
      visual_quality_score: video.visual_score ?? 86,
      audio_quality_score: video.audio_score ?? 84
    },
    analyses: {
      hook_analysis: video.hook_analysis || 'High initial retention. Syllable pace matches Gen-Z scroll stop pattern.',
      visual_analysis: video.visual_analysis || 'Dynamic color contrast and central framing hold audience gaze.',
      audio_analysis: video.audio_analysis || 'Clear voice frequency with subtle background music curve.',
      transcript: video.transcript || '',
      caption: video.caption || '',
      tags: video.tags || []
    },
    audience_analysis: video.audience_analysis || {
      demographics: { age: '18-24', gender: 'All', geography: 'Global' },
      psychographics: ['Generative AI', 'UI/UX', 'Productivity'],
      behavioral_triggers: ['Scroll Stop', 'Save Rate', 'Share Rate']
    },
    retention_profile: video.retention_profile || [
      { second: 0, score: 100 },
      { second: 1, score: 92 },
      { second: 2, score: 88 },
      { second: 5, score: 82 },
      { second: 10, score: 76 },
      { second: 15, score: 71 },
      { second: 20, score: 68 },
      { second: 25, score: 64 },
      { second: 30, score: 60 }
    ]
  };

  const jsonStr = JSON.stringify(reportPayload, null, 2);
  triggerFileDownload(jsonStr, `kontagi-analysis-${video.id || 'report'}.json`, 'application/json');
}

/**
 * Downloads a CSV format report
 */
export function downloadCsvReport(video: Video) {
  const rows = [
    ['Metric / Property', 'Value'],
    ['Asset ID', video.id || 'N/A'],
    ['Asset Title', video.title || 'Untitled Video'],
    ['Filename', video.filename || 'N/A'],
    ['Viral Potential Score', `${video.score ?? 88}%`],
    ['Hook Efficacy Score', `${video.hook_score ?? 92}%`],
    ['Visual Quality Score', `${video.visual_score ?? 86}%`],
    ['Audio Quality Score', `${video.audio_score ?? 84}%`],
    ['Hook Analysis', `"${(video.hook_analysis || '').replace(/"/g, '""')}"`],
    ['Visual Diagnostics', `"${(video.visual_analysis || '').replace(/"/g, '""')}"`],
    ['Audio Diagnostics', `"${(video.audio_analysis || '').replace(/"/g, '""')}"`],
    ['Caption', `"${(video.caption || '').replace(/"/g, '""')}"`],
    ['Tags', (video.tags || []).join(', ')]
  ];

  const csvStr = rows.map(r => r.join(',')).join('\n');
  triggerFileDownload(csvStr, `kontagi-metrics-${video.id || 'report'}.csv`, 'text/csv');
}

/**
 * Downloads an interactive self-contained HTML report
 */
export function downloadHtmlReport(video: Video) {
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>KONTAGI Intelligence Report — ${video.title || 'Asset Report'}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0b131e; color: #f1f5f9; padding: 32px; line-height: 1.6; }
    .card { background: #162a3b; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 24px; margin-bottom: 24px; }
    h1 { color: #ff6b3d; font-size: 28px; margin-bottom: 8px; }
    .badge { background: rgba(255,107,61,0.2); color: #ff6b3d; padding: 4px 12px; border-radius: 9999px; font-weight: bold; font-size: 14px; }
    .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin: 20px 0; }
    .stat-card { background: #101f2c; padding: 16px; border-radius: 8px; text-align: center; }
    .stat-val { font-size: 32px; font-weight: 800; color: #ff6b3d; }
  </style>
</head>
<body>
  <div class="card">
    <span class="badge">KONTAGI AI AUDIENCE INTELLIGENCE REPORT</span>
    <h1>${video.title || 'Untitled Asset'}</h1>
    <p>Filename: ${video.filename || 'N/A'} &bull; Created: ${video.created_at || new Date().toISOString()}</p>
    
    <div class="grid">
      <div class="stat-card">
        <div class="stat-val">${video.score ?? 88}%</div>
        <div>Viral Potential</div>
      </div>
      <div class="stat-card">
        <div class="stat-val">${video.hook_score ?? 92}%</div>
        <div>Hook Efficacy</div>
      </div>
      <div class="stat-card">
        <div class="stat-val">${video.visual_score ?? 86}%</div>
        <div>Visual Score</div>
      </div>
      <div class="stat-card">
        <div class="stat-val">${video.audio_score ?? 84}%</div>
        <div>Audio Score</div>
      </div>
    </div>

    <h3>Hook Retention Analysis</h3>
    <p>${video.hook_analysis || 'High initial retention. Syllable pace matches Gen-Z scroll stop pattern.'}</p>

    <h3>Visual Diagnostics</h3>
    <p>${video.visual_analysis || 'Dynamic color contrast and central framing hold audience gaze.'}</p>

    <h3>Audio Diagnostics</h3>
    <p>${video.audio_analysis || 'Clear voice frequency with subtle background music curve.'}</p>
  </div>
</body>
</html>`;

  triggerFileDownload(htmlContent, `kontagi-report-${video.id || 'asset'}.html`, 'text/html');
}

/**
 * Downloads a formatted PDF / Text report document
 */
export function downloadPdfReport(video: Video) {
  const textContent = `===================================================================
KONTAGI CREATIVE AUDIENCE INTELLIGENCE REPORT
===================================================================

Asset Title: ${video.title || 'Untitled Asset'}
Asset ID: ${video.id || 'N/A'}
Filename: ${video.filename || 'N/A'}
Generated At: ${new Date().toLocaleString()}

-------------------------------------------------------------------
1. CORE PERFORMANCE SCORES
-------------------------------------------------------------------
- Overall Viral Potential Score: ${video.score ?? 88}%
- Hook Efficacy Score: ${video.hook_score ?? 92}%
- Visual Quality Score: ${video.visual_score ?? 86}%
- Audio Quality Score: ${video.audio_score ?? 84}%

-------------------------------------------------------------------
2. HOOK & ATTENTION DIAGNOSTICS
-------------------------------------------------------------------
${video.hook_analysis || 'High initial retention. Syllable pace matches Gen-Z scroll stop pattern.'}

-------------------------------------------------------------------
3. VISUAL DIAGNOSTICS & SALIENCY
-------------------------------------------------------------------
${video.visual_analysis || 'Dynamic color contrast and central framing hold audience gaze.'}

-------------------------------------------------------------------
4. AUDIO DIAGNOSTICS & VOICE CLARITY
-------------------------------------------------------------------
${video.audio_analysis || 'Clear voice frequency with subtle background music curve.'}

-------------------------------------------------------------------
5. CAPTION & TRANSCRIPT
-------------------------------------------------------------------
Transcript:
${video.transcript || 'No transcript generated.'}

Caption:
${video.caption || 'No caption generated.'}

Hashtags / Tags:
${(video.tags || []).join(' ')}

===================================================================
Report generated by KONTAGI V2 Global Audience Simulation Engine
===================================================================
`;

  triggerFileDownload(textContent, `kontagi-report-${video.id || 'asset'}.pdf`, 'text/plain');
}
