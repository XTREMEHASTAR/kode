const fs = require('fs');
const path = require('path');

const BENCHMARK_FILE = path.join(__dirname, 'benchmark-scripts.json');
const REPORT_FILE = path.join(__dirname, 'benchmark-results.json');
const BASE_URL = process.env.SERVER_URL || 'http://127.0.0.1:3000';

async function runBenchmark() {
  console.log('Starting KONTAGI AI Quality Benchmark Suite...');
  if (!fs.existsSync(BENCHMARK_FILE)) {
    console.error(`Benchmark file not found at ${BENCHMARK_FILE}`);
    process.exit(1);
  }

  const scripts = JSON.parse(fs.readFileSync(BENCHMARK_FILE, 'utf8'));
  console.log(`Loaded ${scripts.length} test scripts.\n`);

  const results = [];
  let passCount = 0;
  let partialCount = 0;
  let failCount = 0;

  for (let i = 0; i < scripts.length; i++) {
    const tc = scripts[i];
    console.log(`[${i + 1}/${scripts.length}] Evaluating TC: "${tc.id}" - Category: ${tc.category} (${tc.language})`);
    
    const startTime = Date.now();
    let hookRes = null;
    let scriptRes = null;
    let hookErr = null;
    let scriptErr = null;

    try {
      const resp = await fetch(`${BASE_URL}/api/ai/hook/improve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          script: tc.script,
          contentType: tc.category,
          originalHook: tc.script.split('.')[0],
          tone: 'engaging'
        })
      });
      if (resp.ok) {
        hookRes = await resp.json();
      } else {
        hookErr = `Status ${resp.status}: ${await resp.text()}`;
      }
    } catch (e) {
      hookErr = e.message;
    }

    try {
      const resp = await fetch(`${BASE_URL}/api/ai/script/improve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          script: tc.script,
          contentType: tc.category,
          mode: 'balanced',
          tone: 'engaging'
        })
      });
      if (resp.ok) {
        scriptRes = await resp.json();
      } else {
        scriptErr = `Status ${resp.status}: ${await resp.text()}`;
      }
    } catch (e) {
      scriptErr = e.message;
    }

    const durationMs = Date.now() - startTime;

    // Quality dimension scoring
    const evalResult = evaluateQuality(tc, hookRes, scriptRes, hookErr, scriptErr);
    evalResult.durationMs = durationMs;

    if (evalResult.overallStatus === 'PASS') passCount++;
    else if (evalResult.overallStatus === 'PARTIAL') partialCount++;
    else failCount++;

    results.push({
      testCase: tc,
      evalResult,
      hookRes,
      scriptRes,
      errors: { hookErr, scriptErr }
    });

    console.log(` -> Status: ${evalResult.overallStatus} (${durationMs}ms) | Fact Warnings: ${hookRes?.factWarning || scriptRes?.factWarning ? 'YES' : 'NO'}\n`);
  }

  const summary = {
    total: scripts.length,
    pass: passCount,
    partial: partialCount,
    fail: failCount,
    passRate: `${((passCount / scripts.length) * 100).toFixed(1)}%`,
    timestamp: new Date().toISOString(),
    results
  };

  fs.writeFileSync(REPORT_FILE, JSON.stringify(summary, null, 2));
  console.log('=====================================================');
  console.log(`BENCHMARK COMPLETE. Pass: ${passCount}, Partial: ${partialCount}, Fail: ${failCount}`);
  console.log(`Detailed report written to: ${REPORT_FILE}`);
  console.log('=====================================================');
}

function evaluateQuality(tc, hookRes, scriptRes, hookErr, scriptErr) {
  const scores = {
    contextPreservation: 'PASS',
    meaningPreservation: 'PASS',
    hookQuality: 'PASS',
    specificity: 'PASS',
    naturalLanguage: 'PASS',
    voicePreservation: 'PASS',
    factPreservation: 'PASS',
    languagePreservation: 'PASS',
    variantDiversity: 'PASS',
    noFabrication: 'PASS'
  };

  if (hookErr || scriptErr || !hookRes?.recommendedHook?.text || !scriptRes?.improvedScript) {
    return {
      overallStatus: 'FAIL',
      reason: `API Error: hookErr=${hookErr}, scriptErr=${scriptErr}`,
      scores
    };
  }

  const recHook = hookRes.recommendedHook.text.toLowerCase();
  const impScript = scriptRes.improvedScript.toLowerCase();
  const origLower = tc.script.toLowerCase();

  // 1. Language Preservation
  if (tc.language === 'Hindi') {
    const hasHindiChar = /[\u0900-\u097F]/.test(recHook) && /[\u0900-\u097F]/.test(impScript);
    if (!hasHindiChar) scores.languagePreservation = 'FAIL';
  } else if (tc.language === 'Hinglish') {
    const isHinglishWords = /bhai|hai|kya|aur|kaise|karo|nahi|ko|pe|wala|kar/i.test(recHook) || /bhai|hai|kya|aur|kaise|karo|nahi|ko|pe|wala|kar/i.test(impScript);
    if (!isHinglishWords) scores.languagePreservation = 'PARTIAL';
  }

  // 2. Fact Preservation
  if (tc.factAnchors && tc.factAnchors.length > 0) {
    const missingInScript = tc.factAnchors.filter(anchor => !impScript.includes(anchor.toLowerCase()));
    if (missingInScript.length > 0) {
      if (scriptRes.factWarning) {
        scores.factPreservation = 'PARTIAL';
      } else {
        scores.factPreservation = 'FAIL';
      }
    }
  }

  // 3. Variant Diversity
  if (hookRes.alternatives && hookRes.alternatives.length > 0) {
    const strategies = new Set(hookRes.alternatives.map(a => a.strategy));
    strategies.add(hookRes.recommendedHook.strategy);
    if (strategies.size < 2) {
      scores.variantDiversity = 'PARTIAL';
    }
  }

  // 4. Hook Quality
  if (recHook.length < 10) scores.hookQuality = 'FAIL';

  // Overall determination
  const values = Object.values(scores);
  let overallStatus = 'PASS';
  if (values.includes('FAIL')) {
    overallStatus = 'FAIL';
  } else if (values.includes('PARTIAL')) {
    overallStatus = 'PARTIAL';
  }

  return {
    overallStatus,
    scores
  };
}

runBenchmark();
