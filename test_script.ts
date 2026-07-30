import { analyzeScriptText } from './src/services/scriptAnalysisEngine';

const WEAK = "Hello everyone, welcome back to my channel. Today I am going to talk about some tips for Instagram. Many people use it and posting regularly is a very useful platform.";
const AVERAGE = "Are you making these 3 mistakes on your Reels? Number one, you are not using hooks. Number two, your videos are too long. Number three, bad lighting. Save this video.";
const STRONG_A = "Stop blaming the Instagram algorithm. Your Reels are dying because you're losing viewers in the first 3 seconds. Here is the exact hook formula that doubled my retention.";
const STRONG_B = "You're probably trying to fix the wrong part of your Reel. If your views keep dying, don't change the entire video yet. Check what happens in the first 3 seconds.";

console.log("=== WEAK ===");
console.log(analyzeScriptText(WEAK, "Reel").hookScore);

console.log("=== AVERAGE ===");
console.log(analyzeScriptText(AVERAGE, "Reel").hookScore);

console.log("=== STRONG A ===");
console.log(analyzeScriptText(STRONG_A, "Reel").hookScore);

console.log("=== STRONG B ===");
const resB = analyzeScriptText(STRONG_B, "Reel");
console.log(resB.hookScore);
console.log("Insights:", resB.insights);
console.log("Suggestions:", resB.suggestions.map(s => s.title));
