import { analyzeScriptText } from './src/services/scriptAnalysisEngine';

const WEAK = "Hello everyone, welcome back to my channel. Today I am going to talk about some tips for Instagram. Many people use it and posting regularly is a very useful platform.";
const AVERAGE = "Are you making these 3 mistakes on your Reels? Number one, you are not using hooks. Number two, your videos are too long. Number three, bad lighting. Save this video.";
const STRONG_A = "Stop blaming the Instagram algorithm. Your Reels are dying because you're losing viewers in the first 3 seconds. Here is the exact hook formula that doubled my retention.";
const STRONG_B = "You're probably trying to fix the wrong part of your Reel. If your views keep dying, don't change the entire video yet. Check what happens in the first 3 seconds.";
const STRONG_C = "The algorithm may not be the reason your Reels are failing.";
const STRONG_D = "Most creators focus on the algorithm when the real problem happens before viewers even understand the video.";

console.log("=== SCORES ===");
const weakScore = analyzeScriptText(WEAK, "Reel").hookScore;
const averageScore = analyzeScriptText(AVERAGE, "Reel").hookScore;
const strongScoreA = analyzeScriptText(STRONG_A, "Reel").hookScore;
const resB = analyzeScriptText(STRONG_B, "Reel");
const resC = analyzeScriptText(STRONG_C, "Reel");
const resD = analyzeScriptText(STRONG_D, "Reel");
console.log(`WEAK: ${weakScore}`);
console.log(`AVERAGE: ${averageScore}`);
console.log(`STRONG A: ${strongScoreA}`);
console.log(`STRONG B: ${resB.hookScore}`);

console.log("\n=== CURIOSITY GAP ===");
const cur1 = analyzeScriptText("You're fixing the wrong part of your Reel.", "Reel").canonicalSignals?.curiosityGap;
const cur2 = analyzeScriptText("Here are Instagram tips.", "Reel").canonicalSignals?.curiosityGap;
const cur3 = analyzeScriptText("One mistake is quietly killing your Reel retention.", "Reel").canonicalSignals?.curiosityGap;
console.log(`cur1 (wrong part): ${cur1}`);
console.log(`cur2 (tips): ${cur2}`);
console.log(`cur3 (one mistake): ${cur3}`);

console.log("\n=== EXPECTATION VIOLATION ===");
console.log(`STRONG B: ${resB.canonicalSignals?.expectationViolation}`);
console.log(`STRONG C: ${resC.canonicalSignals?.expectationViolation}`);
console.log(`STRONG D: ${resD.canonicalSignals?.expectationViolation}`);

console.log("\n=== CONSISTENCY IN STRONG B ===");
console.log(`Canonical Timeframe: ${resB.canonicalSignals?.concreteTimeframe}`);
console.log(`Suggestions: ${resB.suggestions.map(s => s.title).join(' | ')}`);
console.log(`Summary: ${resB.hookSupportingText}`);
console.log(`Insights Positive: ${resB.insights.positive.join(' | ')}`);

