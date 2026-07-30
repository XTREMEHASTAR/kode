/**
 * KONTAGI Predictive Retention Engine — Differential Validation Test Suite
 * 
 * Tests the 3 exact benchmark scripts specified in Section 27:
 * TEST A — VERY BAD
 * TEST B — AVERAGE
 * TEST C — STRONG
 */

import { predictRetention } from './retentionPredictionEngine';

export const TEST_SCRIPT_A_BAD = `Hello everyone, welcome back to my page. Today I wanted to talk about Instagram and social media and some things that might help you.

Instagram is a very popular platform and lots of people use it every day. If you want to grow, make good content and post regularly.

There are many things you can try, so just keep trying.

Thanks for watching.`;

export const TEST_SCRIPT_B_AVERAGE = `Getting more views on Instagram Reels isn't just about posting every day.

There are three things you should check if your Reels aren't performing well.

First, make sure your opening gets attention quickly.

Second, keep the video clear.

Third, give viewers a reason to interact.

Try these changes on your next Reel and compare the results.`;

export const TEST_SCRIPT_C_STRONG = `Stop blaming the Instagram algorithm.

Your Reel may be losing viewers before the algorithm even gets a chance to push it.

The first 3 seconds are where many creators make their biggest mistake: they explain the video instead of giving viewers a reason to stay.

Instead of:
'Here are three Instagram tips,'

try:
'If your Reels keep dying at 500 views, you may be making these 3 mistakes.'

Same topic.
Completely different reason to keep watching.

Save this structure before writing your next Reel.`;

export function runRetentionTestSuite() {
  console.log("==================================================");
  console.log("RUNNING KONTAGI RETENTION ENGINE DIFFERENTIAL SUITE");
  console.log("==================================================\n");

  const resA = predictRetention(TEST_SCRIPT_A_BAD);
  const resB = predictRetention(TEST_SCRIPT_B_AVERAGE);
  const resC = predictRetention(TEST_SCRIPT_C_STRONG);

  console.log("TEST A — VERY BAD:");
  console.log(`  Predicted Avg Retention: ${resA.summary.predictedAverageRetention}%`);
  console.log(`  3s Hook Retention:       ${resA.summary.hookRetention}%`);
  console.log(`  Completion Rate:         ${resA.summary.predictedCompletionRate}%`);
  console.log(`  Top Risk:                ${resA.topRisks[0]?.title || 'None'}`);
  console.log("");

  console.log("TEST B — AVERAGE:");
  console.log(`  Predicted Avg Retention: ${resB.summary.predictedAverageRetention}%`);
  console.log(`  3s Hook Retention:       ${resB.summary.hookRetention}%`);
  console.log(`  Completion Rate:         ${resB.summary.predictedCompletionRate}%`);
  console.log(`  Top Risk:                ${resB.topRisks[0]?.title || 'None'}`);
  console.log("");

  console.log("TEST C — STRONG:");
  console.log(`  Predicted Avg Retention: ${resC.summary.predictedAverageRetention}%`);
  console.log(`  3s Hook Retention:       ${resC.summary.hookRetention}%`);
  console.log(`  Completion Rate:         ${resC.summary.predictedCompletionRate}%`);
  console.log(`  Top Risk:                ${resC.topRisks[0]?.title || 'None'}`);
  console.log("");

  // Assertion 1: BAD < AVERAGE < STRONG
  const isAvgAscending = resA.summary.predictedAverageRetention < resB.summary.predictedAverageRetention &&
                         resB.summary.predictedAverageRetention < resC.summary.predictedAverageRetention;

  const isHookAscending = resA.summary.hookRetention < resB.summary.hookRetention &&
                          resB.summary.hookRetention < resC.summary.hookRetention;

  const isCompletionAscending = resA.summary.predictedCompletionRate < resB.summary.predictedCompletionRate &&
                                resB.summary.predictedCompletionRate < resC.summary.predictedCompletionRate;

  console.log("--------------------------------------------------");
  console.log(`ASSERTION: BAD < AVERAGE < STRONG`);
  console.log(`  Average Retention Ascending:   ${isAvgAscending ? 'PASS ✅' : 'FAIL ❌'}`);
  console.log(`  3s Hook Retention Ascending:   ${isHookAscending ? 'PASS ✅' : 'FAIL ❌'}`);
  console.log(`  Completion Rate Ascending:     ${isCompletionAscending ? 'PASS ✅' : 'FAIL ❌'}`);

  // Assertion 2: Determinism (omit timestamp check)
  const resC_repeat = predictRetention(TEST_SCRIPT_C_STRONG);
  const copyC1 = { ...resC, generatedAt: '' };
  const copyC2 = { ...resC_repeat, generatedAt: '' };
  const isDeterministic = JSON.stringify(copyC1) === JSON.stringify(copyC2);

  console.log(`  Determinism Test (Repeat Run): ${isDeterministic ? 'PASS ✅' : 'FAIL ❌'}`);
  console.log("--------------------------------------------------\n");

  return {
    resA,
    resB,
    resC,
    passed: isAvgAscending && isHookAscending && isCompletionAscending && isDeterministic
  };
}
