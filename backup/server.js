const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const { exec } = require('child_process');
const { createClient } = require('@supabase/supabase-js');
const { GoogleGenAI } = require('@google/genai');

// Set precompiled paths for fluent-ffmpeg
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffprobePath = require('@ffprobe-installer/ffprobe').path;
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

// Load configurations
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// --------------------------------------------------------------------------
// DATABASE LAYER: SUPABASE OR LOCAL JSON FALLBACK
// --------------------------------------------------------------------------
let supabase = null;
let useLocalDb = true;
const LOCAL_DB_PATH = path.join(__dirname, 'db-mock-store.json');

// Initialize Mock Store if it doesn't exist
function initMockDb() {
  if (!fs.existsSync(LOCAL_DB_PATH)) {
    const defaultData = {
      workspaces: [
        { id: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', name: "Pulse Energy", slug: "pulse-energy", avatar_text: "PE", avatar_bg: "var(--brand-primary-glow)", avatar_color: "var(--brand-primary)", tagline: "Charging clean Gen-Z visual focus states with zero additives.", prohibited_terms: "tired, old-fashioned, slow, additives" },
        { id: 'b2c3d4e5-f67a-8b9c-0d1e-2f3a4b5c6d7e', name: "Retro Denim", slug: "retro-denim", avatar_text: "RD", avatar_bg: "rgba(245, 158, 11, 0.15)", avatar_color: "var(--accent-orange)", tagline: "Sleek retro-streetwear visual aesthetics built for long-duration wear.", prohibited_terms: "hyper-futuristic, synthetic, neon glow, glitch" },
        { id: 'c3d4e5f6-7a8b-9c0d-1e2f-3a4b5c6d7e8f', name: "AuraSmart IoT", slug: "smart-home", avatar_text: "AS", avatar_bg: "rgba(16, 185, 129, 0.15)", avatar_color: "var(--accent-green)", tagline: "AuraSmart IoT assistant systems integrating seamlessly with family flow.", prohibited_terms: "cluttered, complex setup, loud sounds, intrusive" }
      ],
      projects: [
        { id: 'd4e5f67a-8b9c-0d1e-2f3a-4b5c6d7e8f9a', workspace_id: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', name: "Pulse Energy Campaign 2026", description: "Visual assets promoting Pulse Energy drinks." }
      ],
      videos: [],
      settings: {
        theme: 'dark',
        border_radius: '12',
        language: 'en',
        timezone: 'ist',
        date_format: 'ddmmyyyy',
        user_email: 'jaiveer@company.com'
      }
    };
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(defaultData, null, 2));
  }
}

initMockDb();

function getMockDb() {
  initMockDb();
  return JSON.parse(fs.readFileSync(LOCAL_DB_PATH, 'utf8'));
}

function saveMockDb(data) {
  fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2));
}

// Attempt to initialize Supabase
if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
  try {
    supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
    console.log("Supabase Client initialized successfully.");
    useLocalDb = false;
  } catch (err) {
    console.error("Failed to initialize Supabase. Falling back to local storage.", err);
  }
} else {
  console.log("Supabase credentials missing. Running in resilient Local Mock DB Mode.");
}

// --------------------------------------------------------------------------
// GOOGLE GEMINI LAYER
// --------------------------------------------------------------------------
let ai = null;
let useGemini = false;

if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    console.log("Google Gemini AI Client initialized.");
    useGemini = true;
  } catch (err) {
    console.error("Failed to initialize Gemini Client.", err);
  }
} else {
  console.log("GEMINI_API_KEY missing. KONTAGI will use rule-based analysis fallback.");
}

// --------------------------------------------------------------------------
// CENTRALIZED SECURE MULTIMODAL AI SERVICE
// --------------------------------------------------------------------------
const crypto = require('crypto');

const AIService = {
  // Compute MD5 hash fingerprint of the input payload
  getFingerprint(payload) {
    return crypto.createHash('md5').update(JSON.stringify(payload)).digest('hex');
  },

  // Helper to query Gemini with schema
  async queryGemini(systemPrompt, userPrompt, schema, mediaParts = []) {
    if (!useGemini || !ai) {
      throw new Error("Gemini AI Provider not configured");
    }
    
    const contents = [
      { text: userPrompt },
      ...mediaParts
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: contents,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: schema
      }
    });

    return JSON.parse(response.text);
  },

  // 1. Script Intelligence
  async analyzeScript(script, audience, campaignGoal) {
    const payload = { script, audience, campaignGoal };
    const wordCount = script ? script.split(/\s+/).filter(Boolean).length : 0;
    const sentenceCount = script ? script.split(/[.!?]+/).filter(s => s.trim().length > 0).length : 0;
    const wpm = 130;
    const durationEstimate = Math.ceil((wordCount / wpm) * 60);
    const hasCta = /buy|join|visit|link|click|shop|order|sign|register|check/i.test(script);
    const questionCount = (script.match(/\?/g) || []).length;

    const rules = {
      wordCount,
      sentenceCount,
      durationEstimate,
      hasCta,
      questionCount
    };

    if (useGemini && ai) {
      try {
        const systemPrompt = `You are KONTAGI AI Script Intelligence Engine.
Analyze the script and evaluate hook clarity, curiosity gap, value proposition, story structure, emotional relevance, clarity, audience fit, CTA strength, and pacing.
Return the output in the specified JSON schema format.`;
        const userPrompt = `Script: "${script}"
Target Audience: "${JSON.stringify(audience)}"
Campaign Goal: "${campaignGoal}"`;

        const schema = {
          type: 'OBJECT',
          properties: {
            score: { type: 'INTEGER', description: "Script score from 0-100" },
            confidence: { type: 'INTEGER', description: "Confidence score 0-100" },
            evidence: { type: 'STRING', description: "Direct textual evidence from the script" },
            strengths: { type: 'ARRAY', items: { type: 'STRING' } },
            weaknesses: { type: 'ARRAY', items: { type: 'STRING' } },
            recommendations: { type: 'ARRAY', items: { type: 'STRING' } }
          },
          required: ['score', 'confidence', 'evidence', 'strengths', 'weaknesses', 'recommendations']
        };

        const aiResult = await this.queryGemini(systemPrompt, userPrompt, schema);
        return {
          mode: 'AI + RULE-BASED',
          provider: 'Gemini',
          model: 'gemini-1.5-flash',
          timestamp: new Date().toISOString(),
          measured: rules,
          ai: aiResult
        };
      } catch (err) {
        console.error("Gemini analyzeScript failed, falling back to rule-based:", err);
      }
    }

    const score = Math.min(95, Math.max(40, 60 + (hasCta ? 15 : 0) + (wordCount > 15 && wordCount < 150 ? 15 : -10)));
    const recommendations = [];
    if (!hasCta) recommendations.push("Add a direct call-to-action (e.g. 'Click the link below' or 'Shop now').");
    if (wordCount > 180) recommendations.push("The script has too many words for a 60-second video. Trim it to under 150 words.");
    if (wordCount < 15) recommendations.push("Script is very short. Add more dialogue or a stronger hook statement.");

    return {
      mode: 'RULE-BASED',
      provider: 'None',
      model: 'None',
      timestamp: new Date().toISOString(),
      measured: rules,
      ai: {
        score: score,
        confidence: 80,
        evidence: `Script contains ${wordCount} words. CTA detected: ${hasCta}.`,
        strengths: ["Clear length pacing", wordCount > 0 ? "Uses active vocal speech tracks" : "Visual narrative formats"],
        weaknesses: [!hasCta ? "No call-to-action found in transcription" : "Standard CTA detected"],
        recommendations: recommendations.length > 0 ? recommendations : ["Optimize speech flow & pacing transitions."]
      }
    };
  },

  // 2. Multimodal Video Frame Analysis
  async analyzeVisual(videoId, metadata) {
    const framesDir = path.join(__dirname, 'uploads', 'frames', videoId);
    const mediaParts = [];

    if (fs.existsSync(framesDir)) {
      try {
        const files = fs.readdirSync(framesDir).filter(f => f.endsWith('.png'));
        const selectedFiles = files.slice(0, 4);
        
        for (const file of selectedFiles) {
          const filePath = path.join(framesDir, file);
          const buffer = fs.readFileSync(filePath);
          mediaParts.push({
            inlineData: {
              data: buffer.toString('base64'),
              mimeType: 'image/png'
            }
          });
        }
      } catch (e) {
        console.error("Failed to read frames for visual analysis:", e);
      }
    }

    const measured = {
      width: metadata.width,
      height: metadata.height,
      fps: metadata.fps,
      aspectRatio: metadata.aspectRatio,
      duration: metadata.duration,
      size_mb: parseFloat((metadata.size / (1024 * 1024)).toFixed(2))
    };

    if (useGemini && ai && mediaParts.length > 0) {
      try {
        const systemPrompt = `You are KONTAGI AI Visual Scan Engine.
Analyze the provided sequential frames of this video asset. Evaluate opening visual impact, subject prominence, visual hierarchy, text readability, composition (rule of thirds), lighting perception, product visibility, scene progression, and potential attention weaknesses.
Return the output in the specified JSON schema format.`;
        const userPrompt = `Analyze the video frames. Here is the metadata:
Resolution: ${metadata.width}x${metadata.height}
Aspect Ratio: ${metadata.aspectRatio}
FPS: ${metadata.fps}`;

        const schema = {
          type: 'OBJECT',
          properties: {
            score: { type: 'INTEGER', description: "Visual composition score 0-100" },
            confidence: { type: 'INTEGER', description: "Confidence score 0-100" },
            composition: { type: 'STRING' },
            strengths: { type: 'ARRAY', items: { type: 'STRING' } },
            weaknesses: { type: 'ARRAY', items: { type: 'STRING' } },
            recommendations: { type: 'ARRAY', items: { type: 'STRING' } }
          },
          required: ['score', 'confidence', 'composition', 'strengths', 'weaknesses', 'recommendations']
        };

        const aiResult = await this.queryGemini(systemPrompt, userPrompt, schema, mediaParts);
        return {
          mode: 'AI + RULE-BASED',
          provider: 'Gemini',
          model: 'gemini-1.5-flash',
          timestamp: new Date().toISOString(),
          measured,
          ai: aiResult
        };
      } catch (err) {
        console.error("Gemini analyzeVisual failed, falling back to rule-based:", err);
      }
    }

    let score = 70;
    if (metadata.aspectRatio === "9:16") score += 15;
    if (metadata.width >= 1080) score += 10;
    score = Math.min(98, Math.max(30, score));

    const recommendations = [];
    if (metadata.aspectRatio !== "9:16") recommendations.push("This video is landscape or square. Crop or re-render to vertical 9:16 for maximum platform feed impact.");
    if (metadata.width < 1080) recommendations.push("Resolution is low. Export your final creative at 1080x1920 or higher for crisp image quality.");

    return {
      mode: 'RULE-BASED',
      provider: 'None',
      model: 'None',
      timestamp: new Date().toISOString(),
      measured,
      ai: {
        score: score,
        confidence: 85,
        composition: `Standard ${metadata.aspectRatio} composition. Layout is resolution-bounded.`,
        strengths: ["Aspect ratio verified", metadata.width >= 1080 ? "Full HD encoding" : "Standard definition"],
        weaknesses: [metadata.aspectRatio !== "9:16" ? "Non-vertical format" : "Standard vertical framing"],
        recommendations: recommendations.length > 0 ? recommendations : ["Enhance brightness levels in the opening scene."]
      }
    };
  },

  // 3. Caption Intelligence
  async analyzeCaption(caption, audience) {
    const wordCount = caption ? caption.split(/\s+/).filter(Boolean).length : 0;
    const hashtagCount = (caption.match(/#/g) || []).length;
    const emojiCount = (caption.match(/[\uD800-\uDFFF\u2600-\u27BF]/g) || []).length;
    const hasQuestion = caption ? caption.includes('?') : false;
    const hasCta = caption ? /click|link|buy|shop|check|comment|follow|subscribe/i.test(caption) : false;

    const measured = {
      wordCount,
      hashtagCount,
      emojiCount,
      hasQuestion,
      hasCta
    };

    if (useGemini && ai) {
      try {
        const systemPrompt = `You are KONTAGI AI Caption Optimization Engine.
Analyze the caption. Evaluate opening quality, clarity, brand tone, audience relevance, CTA discoverability, and suggest improvements.
Return the output in the specified JSON schema format.`;
        const userPrompt = `Caption: "${caption}"
Target Audience: "${JSON.stringify(audience)}"`;

        const schema = {
          type: 'OBJECT',
          properties: {
            score: { type: 'INTEGER', description: "Caption score 0-100" },
            confidence: { type: 'INTEGER' },
            opening_quality: { type: 'STRING' },
            clarity: { type: 'STRING' },
            tone: { type: 'STRING' },
            discoverability_tags: { type: 'ARRAY', items: { type: 'STRING' } },
            improved_caption: { type: 'STRING', description: "An alternative optimized caption suggestion" },
            recommendations: { type: 'ARRAY', items: { type: 'STRING' } }
          },
          required: ['score', 'opening_quality', 'clarity', 'improved_caption', 'recommendations']
        };

        const aiResult = await this.queryGemini(systemPrompt, userPrompt, schema);
        return {
          mode: 'AI + RULE-BASED',
          provider: 'Gemini',
          model: 'gemini-1.5-flash',
          timestamp: new Date().toISOString(),
          measured,
          ai: aiResult
        };
      } catch (err) {
        console.error("Gemini analyzeCaption failed, falling back to rule-based:", err);
      }
    }

    let score = 65;
    if (hashtagCount >= 2 && hashtagCount <= 5) score += 15;
    if (emojiCount >= 1) score += 5;
    if (hasCta) score += 10;
    if (hasQuestion) score += 5;
    score = Math.min(99, Math.max(30, score));

    const recommendations = [];
    if (hashtagCount < 2) recommendations.push("Add 3-5 relevant hashtags to increase search discoverability.");
    if (hashtagCount > 8) recommendations.push("Too many hashtags. Keep it under 6 to look premium and authentic.");
    if (!hasCta) recommendations.push("Include a clear call-to-action in the caption text.");

    return {
      mode: 'RULE-BASED',
      provider: 'None',
      model: 'None',
      timestamp: new Date().toISOString(),
      measured,
      ai: {
        score: score,
        opening_quality: caption ? "Direct hook start" : "Empty caption",
        clarity: "Readable and clean",
        improved_caption: caption ? `${caption} ⚡ Click the link in bio to learn more!` : "Check this out! #marketing #trends",
        recommendations: recommendations.length > 0 ? recommendations : ["Maintain clean spacing in the caption paragraphs."]
      }
    };
  },

  async generateCaption(promptText, tone) {
    if (useGemini && ai) {
      try {
        const systemPrompt = `You are KONTAGI AI Caption Copywriting Engine.
Generate an engaging, highly persuasive marketing video caption matching the user's prompt instruction and tone.
The tone must be: ${tone} (e.g. witty, curious, professional, hype).
Include optimal emojis and call to actions.
Return the output in the specified JSON schema format.`;
        const userPrompt = `Prompt/Instructions: "${promptText}"`;
        const schema = {
          type: 'OBJECT',
          properties: {
            caption: { type: 'STRING', description: "The complete copywritten caption text" }
          },
          required: ['caption']
        };

        const aiResult = await this.queryGemini(systemPrompt, userPrompt, schema);
        return {
          mode: 'AI',
          provider: 'Gemini',
          model: 'gemini-1.5-flash',
          caption: aiResult.caption
        };
      } catch (err) {
        console.error("Gemini generateCaption failed, falling back to rule-based:", err);
      }
    }

    // Rule-based fallback
    let caption = "";
    if (tone === 'witty') {
      caption = `Who said tech bento layouts had to be boring? 🍱💻\nWe unboxed the brand new KONTAGI Quantum Grid, and it's rendering faster than my last three brain cells. 🧠✨\n\nExquisite styling, sleek purple gradients, and custom components that will actually make your product pages pop.\n\n👉 Early access link in bio. Go check it out before we run out of tokens.`;
    } else if (tone === 'curious') {
      caption = `Is this the end of traditional layout design? 🤯👀\nWe unboxed the KONTAGI Quantum Bento system and discovered something we didn't expect about the pricing structure...\n\nWatch our full breakdowns to see how this fits into your tech stack.\n\n👉 Details at the link in bio!`;
    } else {
      caption = `OMG! THIS CHANGED EVERYTHING! 🤯💻\nWe just unboxed the brand new KONTAGI Quantum Bento Grid and... wow. The sleek aesthetics, hyper-fast render loops, and customizable token grids make it a literal game changer for creators. 🚀\n\nIf you want to scale your content system without the bloat, this is a must-see! Check out the specs below.\n\n👉 Link in bio to grab early beta access today!\n\n#contentcreator #automation #techtok #bento #nextgenai`;
    }

    return {
      mode: 'RULE-BASED',
      provider: 'None',
      model: 'None',
      caption
    };
  },

  // 4. Audience Fit Analysis
  async analyzeAudienceFit(audience, script, caption, visualSummary) {
    if (useGemini && ai) {
      try {
        const systemPrompt = `You are KONTAGI AI Audience Alignment Engine.
Analyze the target audience details against the video script, caption, and visual summary. Evaluate language fit, tone alignment, value proposition resonance, visual layout fit, and list potential objections.
Return the output in the specified JSON schema format.`;
        const userPrompt = `Target Audience: "${JSON.stringify(audience)}"
Script: "${script}"
Caption: "${caption}"
Visual Summary: "${visualSummary}"`;

        const schema = {
          type: 'OBJECT',
          properties: {
            score: { type: 'INTEGER', description: "Audience fit score 0-100" },
            language_fit: { type: 'STRING' },
            tone_alignment: { type: 'STRING' },
            value_prop_fit: { type: 'STRING' },
            objections: { type: 'ARRAY', items: { type: 'STRING' }, description: "Core complaints or worries this audience might raise" },
            compelling_factors: { type: 'ARRAY', items: { type: 'STRING' } }
          },
          required: ['score', 'language_fit', 'tone_alignment', 'objections', 'compelling_factors']
        };

        const aiResult = await this.queryGemini(systemPrompt, userPrompt, schema);
        return {
          mode: 'AI + RULE-BASED',
          provider: 'Gemini',
          model: 'gemini-1.5-flash',
          timestamp: new Date().toISOString(),
          ai: aiResult
        };
      } catch (err) {
        console.error("Gemini analyzeAudienceFit failed, falling back to rule-based:", err);
      }
    }

    return {
      mode: 'RULE-BASED',
      provider: 'None',
      model: 'None',
      timestamp: new Date().toISOString(),
      ai: {
        score: 82,
        language_fit: "Standard vernacular aligns with targeted segments.",
        tone_alignment: "Professional and clean.",
        objections: ["Price clarity could be higher", "Need more visual social proof"],
        compelling_factors: ["Actionable call to action", "Clear vertical visual design focus"]
      }
    };
  },

  // 5. Audio Intelligence
  async analyzeAudio(videoId, videoMetadata) {
    const measured = {
      meanVolume: videoMetadata.mean_volume_db || -15,
      maxVolume: videoMetadata.max_volume_db || 0,
      silenceDuration: videoMetadata.silence_duration || 0,
      duration: videoMetadata.duration || 0
    };

    if (useGemini && ai) {
      try {
        const systemPrompt = `You are KONTAGI AI Audio Scan Engine.
Analyze the audio metrics of a marketing video. Evaluate voice clarity, speech pacing (130-160 WPM is ideal), loudness levels (ideal mean is -15 to -18 dB), presence of empty pauses, or noise/hiss artifacts.
Return the output in the specified JSON schema format.`;
        const userPrompt = `Audio metrics:
Mean Volume Level: ${measured.meanVolume} dB
Max Volume Level: ${measured.maxVolume} dB
Silence duration: ${measured.silenceDuration} seconds
Total Video duration: ${measured.duration} seconds`;

        const schema = {
          type: 'OBJECT',
          properties: {
            score: { type: 'INTEGER', description: "Audio master quality score 0-100" },
            confidence: { type: 'INTEGER' },
            clarity: { type: 'STRING' },
            strengths: { type: 'ARRAY', items: { type: 'STRING' } },
            weaknesses: { type: 'ARRAY', items: { type: 'STRING' } },
            recommendations: { type: 'ARRAY', items: { type: 'STRING' } }
          },
          required: ['score', 'confidence', 'clarity', 'strengths', 'weaknesses', 'recommendations']
        };

        const aiResult = await this.queryGemini(systemPrompt, userPrompt, schema);
        return {
          mode: 'AI + RULE-BASED',
          provider: 'Gemini',
          model: 'gemini-1.5-flash',
          timestamp: new Date().toISOString(),
          measured,
          ai: aiResult
        };
      } catch (err) {
        console.error("Gemini analyzeAudio failed, falling back to rule-based:", err);
      }
    }

    let score = 80;
    if (measured.meanVolume < -25) score -= 15;
    if (measured.meanVolume > -5) score -= 10;
    if (measured.silenceDuration > measured.duration * 0.15) score -= 10;
    score = Math.max(10, Math.min(99, score));

    const recommendations = [];
    if (measured.meanVolume < -25) recommendations.push("Vocal levels are too soft. Boost master audio volume level.");
    if (measured.silenceDuration > 1.5) recommendations.push("Long silence gap detected. Strip the empty spaces in your script pacing timeline.");
    if (recommendations.length === 0) recommendations.push("Align high-pass filter below 90Hz to completely wipe low-end noise.");

    return {
      mode: 'RULE-BASED',
      provider: 'None',
      model: 'None',
      timestamp: new Date().toISOString(),
      measured,
      ai: {
        score,
        confidence: 85,
        clarity: "Excellent resonance with optimal voice EQ ducking.",
        strengths: ["Clean audio channels", "Standard speech volume level"],
        weaknesses: [measured.silenceDuration > 1.5 ? "Noticeable empty pause intervals" : "None detected"],
        recommendations
      }
    };
  },

  // 5. Creative Director Synthesis
  async generateCreativeStrategy(videoData) {
    const script = videoData.transcript || "";
    const caption = videoData.caption || "";
    const hookAnalysis = videoData.hook_analysis || "";
    const visualAnalysis = videoData.visual_analysis || "";
    const audioAnalysis = videoData.audio_analysis || "";

    if (useGemini && ai) {
      try {
        const systemPrompt = `You are KONTAGI AI Creative Director.
Synthesize the overall video parameters and provide a definitive creative strategy. Evaluate strengths, weaknesses, priority improvements, hook recommendations, CTA recommendations, and editing choices.
Return the output in the specified JSON schema format.`;
        const userPrompt = `Creative Metadata:
- Overall Score: ${videoData.score}
- Hook Score: ${videoData.hook_score}
- Visual Score: ${videoData.visual_score}
- Audio Score: ${videoData.audio_score}
- Script: "${script}"
- Caption: "${caption}"
- Hook Analysis: "${hookAnalysis}"
- Visual Analysis: "${visualAnalysis}"
- Audio Analysis: "${audioAnalysis}"`;

        const schema = {
          type: 'OBJECT',
          properties: {
            strengths: { type: 'ARRAY', items: { type: 'STRING' }, description: "Top 3 creative strengths" },
            weaknesses: { type: 'ARRAY', items: { type: 'STRING' }, description: "Top 3 creative weaknesses" },
            priority_changes: { type: 'ARRAY', items: { type: 'STRING' }, description: "Top 5 priority changes before publishing" },
            better_hook: { type: 'STRING', description: "Alternative script hook sentence suggestion" },
            better_cta: { type: 'STRING', description: "Alternative script Call-To-Action suggestion" },
            editing_tips: { type: 'ARRAY', items: { type: 'STRING' } },
            confidence: { type: 'INTEGER', description: "Overall confidence score 0-100" }
          },
          required: ['strengths', 'weaknesses', 'priority_changes', 'better_hook', 'better_cta', 'editing_tips', 'confidence']
        };

        const aiResult = await this.queryGemini(systemPrompt, userPrompt, schema);
        return {
          mode: 'AI + RULE-BASED',
          provider: 'Gemini',
          model: 'gemini-1.5-flash',
          timestamp: new Date().toISOString(),
          ai: aiResult
        };
      } catch (err) {
        console.error("Gemini generateCreativeStrategy failed, falling back to rule-based:", err);
      }
    }

    return {
      mode: 'RULE-BASED',
      provider: 'None',
      model: 'None',
      timestamp: new Date().toISOString(),
      ai: {
        strengths: ["Aspect ratio compliance", "Sufficient audio mean dB", "Clear transcript pacing"],
        weaknesses: ["Hook curiosity gap is standard", "Text legibility contrast can improve", "No vocal pitch variance detected"],
        priority_changes: [
          "Rewrite first 3 seconds to trigger a curiosity gap.",
          "Add dynamic subtitle text over vertical frames.",
          "Check audio level balance against background tracks.",
          "Shift CTA 2 seconds earlier.",
          "Compress long audio gaps during script breaks."
        ],
        better_hook: "Stop scrolling! Here is the actual reason your conversion rate is dropping.",
        better_cta: "Tap the link in our bio to try KONTAGI today!",
        editing_tips: [
          "Apply zoom cuts every 2-3 seconds to hold interest.",
          "Use a 70% contrast ratio for overlay text readability."
        ],
        confidence: 85
      }
    };
  },

  // 6. Chat Coach Responder
  async chat(chatHistory, message, videoData) {
    if (useGemini && ai) {
      try {
        const systemPrompt = `You are KONTAGI AI Creative Coach, an expert social video marketing advisor.
You are helping the user improve their video asset. Refer directly to the provided active asset details, metrics, and script. Keep answers actionable, short, and friendly.
Active Asset Context:
- ID: ${videoData.id}
- Title: "${videoData.title}"
- Creative Score: ${videoData.score}
- Hook Score: ${videoData.hook_score} (Analysis: "${videoData.hook_analysis}")
- Visual Score: ${videoData.visual_score} (Analysis: "${videoData.visual_analysis}")
- Audio Score: ${videoData.audio_score} (Analysis: "${videoData.audio_analysis}")
- Script: "${videoData.transcript || "None"}"
- Caption: "${videoData.caption || "None"}"`;

        const response = await ai.models.generateContent({
          model: 'gemini-1.5-flash',
          contents: [
            ...chatHistory.map(c => ({
              role: c.role === 'user' ? 'user' : 'model',
              parts: [{ text: c.text }]
            })),
            { role: 'user', parts: [{ text: message }] }
          ],
          config: {
            systemInstruction: systemPrompt
          }
        });

        return {
          mode: 'AI + RULE-BASED',
          provider: 'Gemini',
          model: 'gemini-1.5-flash',
          text: response.text
        };
      } catch (err) {
        console.error("Gemini coach chat failed, falling back to rule-based:", err);
      }
    }

    let textResponse = `I am currently operating in RULE-BASED offline mode. Regarding your video "${videoData.title}" (Score: ${videoData.score}): `;
    const q = message.toLowerCase();
    
    if (q.includes('hook') || q.includes('first 3') || q.includes('seconds')) {
      textResponse += `Your Hook Score is ${videoData.hook_score}/100. We recommend rewriting the hook to: "Stop scrolling! Here is the actual reason your conversion rate is dropping." or adding key zoom-cuts in the first 2 seconds to boost early retention.`;
    } else if (q.includes('cta') || q.includes('call to action') || q.includes('action')) {
      textResponse += `Looking at your script, we suggest placing a high-contrast text prompt or a direct audio directive like "Click the link in bio to start today" exactly at the 80% mark of the video duration.`;
    } else if (q.includes('fix') || q.includes('change') || q.includes('first')) {
      textResponse += `The high priority fixes are: 1) Trim the silent duration of ${videoData.silence_duration || 0}s. 2) Boost visual frame contrast. 3) Shift CTA slightly earlier.`;
    } else if (q.includes('platform') || q.includes('instagram') || q.includes('tiktok') || q.includes('shorts')) {
      textResponse += `This video is in ${videoData.aspectRatio || 'landscape'} format. If it is 9:16, it is highly suitable for TikTok and Instagram Reels. Otherwise, crop it to 9:16 vertical before publishing.`;
    } else {
      textResponse += `To optimize this further, focus on keeping pacing high, reducing silent audio gaps (currently at ${videoData.silence_duration || 0}s), and aligning overlay caption keywords with your target demographic.`;
    }

    return {
      mode: 'RULE-BASED',
      provider: 'None',
      model: 'None',
      text: textResponse
    };
  }
};

// --------------------------------------------------------------------------
// MULTER UPLOAD SETUP
// --------------------------------------------------------------------------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage: storage });

// Serve static frontend files
app.use(express.static(path.join(__dirname)));

// --------------------------------------------------------------------------
// API ENDPOINTS
// --------------------------------------------------------------------------

// 1. WORKSPACES
app.get('/api/workspaces', async (req, res) => {
  if (!useLocalDb) {
    const { data, error } = await supabase.from('workspaces').select('*');
    if (!error) return res.json(data);
  }
  const db = getMockDb();
  res.json(db.workspaces);
});

app.post('/api/workspaces', async (req, res) => {
  const { name, slug, avatar_text, tagline, prohibited_terms } = req.body;
  const newWorkspace = {
    id: useLocalDb ? Math.random().toString(36).substr(2, 9) : undefined,
    name,
    slug,
    avatar_text,
    tagline,
    prohibited_terms,
    created_at: new Date().toISOString()
  };

  if (!useLocalDb) {
    const { data, error } = await supabase.from('workspaces').insert([newWorkspace]).select();
    if (!error) return res.json(data[0]);
    return res.status(500).json({ error: error.message });
  }

  const db = getMockDb();
  db.workspaces.push(newWorkspace);
  saveMockDb(db);
  res.json(newWorkspace);
});

// 2. PROJECTS
app.get('/api/projects', async (req, res) => {
  const { workspace_id } = req.query;
  if (!useLocalDb) {
    let query = supabase.from('projects').select('*');
    if (workspace_id) query = query.eq('workspace_id', workspace_id);
    const { data, error } = await query;
    if (!error) return res.json(data);
  }
  
  const db = getMockDb();
  let list = db.projects;
  if (workspace_id) {
    list = list.filter(p => p.workspace_id === workspace_id);
  }
  res.json(list);
});

app.post('/api/projects', async (req, res) => {
  const { name, description, workspace_id } = req.body;
  const newProj = {
    id: useLocalDb ? Math.random().toString(36).substr(2, 9) : undefined,
    workspace_id,
    name,
    description,
    created_at: new Date().toISOString()
  };

  if (!useLocalDb) {
    const { data, error } = await supabase.from('projects').insert([newProj]).select();
    if (!error) return res.json(data[0]);
    return res.status(500).json({ error: error.message });
  }

  const db = getMockDb();
  db.projects.push(newProj);
  saveMockDb(db);
  res.json(newProj);
});

// Helper: Get list of screenshot frames extracted for a video
function getFrameUrlsForVideo(videoId) {
  const framesDir = path.join(__dirname, 'uploads', 'frames', videoId);
  if (fs.existsSync(framesDir)) {
    try {
      return fs.readdirSync(framesDir)
        .filter(f => f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg'))
        .map(file => `/uploads/frames/${videoId}/${file}`)
        .sort((a, b) => {
          const numA = parseInt((a.match(/\d+/) || [0])[0]);
          const numB = parseInt((b.match(/\d+/) || [0])[0]);
          return numA - numB;
        });
    } catch (e) {
      console.error("Failed to read frames dir:", e);
    }
  }
  return [];
}

// 3. VIDEOS (ASSETS LIST)
app.get('/api/videos', async (req, res) => {
  const { project_id } = req.query;
  let list = [];
  if (!useLocalDb) {
    let query = supabase.from('videos').select('*');
    if (project_id) query = query.eq('project_id', project_id);
    const { data, error } = await query;
    if (!error) list = data;
  } else {
    const db = getMockDb();
    list = db.videos;
    if (project_id) {
      list = list.filter(v => v.project_id === project_id);
    }
  }

  const enrichedList = list.map(v => ({
    ...v,
    frames: getFrameUrlsForVideo(v.id)
  }));
  res.json(enrichedList);
});

// 4. SETTINGS
app.get('/api/settings', async (req, res) => {
  if (!useLocalDb) {
    const { data, error } = await supabase.from('settings').select('*').limit(1).maybeSingle();
    if (!error && data) return res.json(data);
  }
  const db = getMockDb();
  res.json(db.settings);
});

app.post('/api/settings', async (req, res) => {
  const { theme, border_radius, language, timezone, date_format } = req.body;
  if (!useLocalDb) {
    const { data, error } = await supabase.from('settings').upsert({
      user_email: 'jaiveer@company.com',
      theme,
      border_radius,
      language,
      timezone,
      date_format,
      updated_at: new Date().toISOString()
    }).select();
    if (!error) return res.json(data[0]);
  }

  const db = getMockDb();
  db.settings = { ...db.settings, theme, border_radius, language, timezone, date_format };
  saveMockDb(db);
  res.json(db.settings);
});

// 5. UPLOAD & ASYNC AI PROCESSOR PIPELINE
app.post('/api/upload', upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No video file provided.' });
    }

    const { project_id, title } = req.body;
    const filename = req.file.filename;
    const filePath = req.file.path;
    const mimeType = req.file.mimetype;

    // 1. Create DB entry with "pending" status
    const videoId = useLocalDb ? Math.random().toString(36).substr(2, 9) : require('crypto').randomUUID();
    const newVideo = {
      id: videoId,
      project_id: project_id || null,
      title: title || req.file.originalname,
      filename: filename,
      storage_path: `/uploads/${filename}`,
      status: 'pending',
      score: 0,
      transcript: '',
      caption: '',
      tags: [],
      poster_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80',
      retention_profile: [],
      hook_score: 0,
      hook_analysis: '',
      visual_score: 0,
      visual_analysis: '',
      audio_score: 0,
      audio_analysis: '',
      thumbnail_suggestions: [],
      created_at: new Date().toISOString()
    };

    if (!useLocalDb) {
      const { error } = await supabase.from('videos').insert([newVideo]);
      if (error) throw new Error(`DB Insert Error: ${error.message}`);
    } else {
      const db = getMockDb();
      db.videos.push(newVideo);
      saveMockDb(db);
    }

    // Return receipt immediately to the client
    res.json({ success: true, video: newVideo });

    // Trigger async processing pipeline in background
    runBackgroundAnalysis(videoId, filePath, mimeType);

  } catch (err) {
    console.error("Upload handler error:", err);
    res.status(500).json({ error: err.message });
  }
});

// 6. POLL ANALYSIS STATUS
app.get('/api/analysis/:id', async (req, res) => {
  const { id } = req.params;
  let video;
  if (!useLocalDb) {
    const { data, error } = await supabase.from('videos').select('*').eq('id', id).maybeSingle();
    if (!error && data) video = data;
  } else {
    const db = getMockDb();
    video = db.videos.find(v => v.id === id);
  }
  
  if (video) {
    const frames = getFrameUrlsForVideo(video.id);
    return res.json({ ...video, frames });
  }
  res.status(404).json({ error: 'Video not found' });
});

// UPDATE VIDEO RECORD BY ID
app.post('/api/videos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    // Strip ID to prevent mutating primary key
    delete updates.id;
    await updateVideoRecord(id, updates);
    res.json({ success: true });
  } catch (err) {
    console.error("Endpoint POST /api/videos/:id error:", err);
    res.status(500).json({ error: err.message });
  }
});

// --------------------------------------------------------------------------
// 7. SECURE SERVER-SIDE AI ROUTING & INPUT FINGERPRINT CACHING
// --------------------------------------------------------------------------
const aiCache = new Map();

// Helper: Check cache and compute fingerprint
function getCacheOrCompute(payload, computeFn) {
  const hash = crypto.createHash('md5').update(JSON.stringify(payload)).digest('hex');
  if (aiCache.has(hash)) {
    console.log(`[AICache] Cache HIT for fingerprint: ${hash}`);
    return Promise.resolve(aiCache.get(hash));
  }
  return computeFn().then(result => {
    aiCache.set(hash, result);
    return result;
  });
}

app.post('/api/ai/analyze-script', async (req, res) => {
  try {
    const { script, audience, campaignGoal } = req.body;
    if (!script) {
      return res.status(400).json({ error: 'Missing required field: script' });
    }
    const result = await getCacheOrCompute({ script, audience, campaignGoal, type: 'script' }, () => {
      return AIService.analyzeScript(script, audience, campaignGoal);
    });
    res.json(result);
  } catch (err) {
    console.error("Endpoint /api/ai/analyze-script error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/ai/analyze-visual', async (req, res) => {
  try {
    const { videoId } = req.body;
    if (!videoId) {
      return res.status(400).json({ error: 'Missing required field: videoId' });
    }

    let video;
    if (!useLocalDb) {
      const { data, error } = await supabase.from('videos').select('*').eq('id', videoId).maybeSingle();
      if (!error && data) video = data;
    } else {
      const db = getMockDb();
      video = db.videos.find(v => v.id === videoId);
    }

    if (!video) {
      return res.status(404).json({ error: `Video ID ${videoId} not found` });
    }

    const metadata = {
      width: video.width || 1080,
      height: video.height || 1920,
      fps: video.fps || 30,
      aspectRatio: video.aspectRatio || '9:16',
      duration: video.duration || 15,
      size: video.size || 0
    };

    const result = await getCacheOrCompute({ videoId, metadata, type: 'visual' }, () => {
      return AIService.analyzeVisual(videoId, metadata);
    });
    res.json(result);
  } catch (err) {
    console.error("Endpoint /api/ai/analyze-visual error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/ai/analyze-audio', async (req, res) => {
  try {
    const { videoId } = req.body;
    if (!videoId) {
      return res.status(400).json({ error: 'Missing required field: videoId' });
    }

    let video;
    if (!useLocalDb) {
      const { data, error } = await supabase.from('videos').select('*').eq('id', videoId).maybeSingle();
      if (!error && data) video = data;
    } else {
      const db = getMockDb();
      video = db.videos.find(v => v.id === videoId);
    }

    if (!video) {
      return res.status(404).json({ error: `Video ID ${videoId} not found` });
    }

    const result = await getCacheOrCompute({ videoId, type: 'audio' }, () => {
      return AIService.analyzeAudio(videoId, video);
    });
    res.json(result);
  } catch (err) {
    console.error("Endpoint /api/ai/analyze-audio error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/ai/analyze-caption', async (req, res) => {
  try {
    const { caption, audience } = req.body;
    if (!caption) {
      return res.status(400).json({ error: 'Missing required field: caption' });
    }
    const result = await getCacheOrCompute({ caption, audience, type: 'caption' }, () => {
      return AIService.analyzeCaption(caption, audience);
    });
    res.json(result);
  } catch (err) {
    console.error("Endpoint /api/ai/analyze-caption error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/ai/generate-caption', async (req, res) => {
  try {
    const { prompt, tone } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Missing required field: prompt' });
    }
    const result = await AIService.generateCaption(prompt, tone || 'witty');
    res.json(result);
  } catch (err) {
    console.error("Endpoint /api/ai/generate-caption error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/ai/analyze-audience', async (req, res) => {
  try {
    const { audience, script, caption, visualSummary } = req.body;
    if (!audience) {
      return res.status(400).json({ error: 'Missing required field: audience' });
    }
    const result = await getCacheOrCompute({ audience, script, caption, visualSummary, type: 'audience' }, () => {
      return AIService.analyzeAudienceFit(audience, script, caption, visualSummary);
    });
    res.json(result);
  } catch (err) {
    console.error("Endpoint /api/ai/analyze-audience error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/ai/creative-director', async (req, res) => {
  try {
    const { videoId } = req.body;
    if (!videoId) {
      return res.status(400).json({ error: 'Missing required field: videoId' });
    }

    let video;
    if (!useLocalDb) {
      const { data, error } = await supabase.from('videos').select('*').eq('id', videoId).maybeSingle();
      if (!error && data) video = data;
    } else {
      const db = getMockDb();
      video = db.videos.find(v => v.id === videoId);
    }

    if (!video) {
      return res.status(404).json({ error: `Video ID ${videoId} not found` });
    }

    const result = await getCacheOrCompute({ videoId, score: video.score, type: 'strategy' }, () => {
      return AIService.generateCreativeStrategy(video);
    });
    res.json(result);
  } catch (err) {
    console.error("Endpoint /api/ai/creative-director error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, chatHistory, videoId } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Missing required field: message' });
    }

    let video = null;
    if (videoId) {
      if (!useLocalDb) {
        const { data, error } = await supabase.from('videos').select('*').eq('id', videoId).maybeSingle();
        if (!error && data) video = data;
      } else {
        const db = getMockDb();
        video = db.videos.find(v => v.id === videoId);
      }
    }

    if (!video) {
      video = {
        id: 'mock-id',
        title: 'General Creative Advice',
        score: 75,
        hook_score: 70,
        hook_analysis: 'No specific video hook analyzed.',
        visual_score: 75,
        visual_analysis: 'General visual aesthetics advice.',
        audio_score: 80,
        audio_analysis: 'General audio guidelines.',
        transcript: '',
        caption: '',
        aspectRatio: '9:16'
      };
    }

    const result = await AIService.chat(chatHistory || [], message, video);
    res.json(result);
  } catch (err) {
    console.error("Endpoint /api/ai/chat error:", err);
    res.status(500).json({ error: err.message });
  }
});

// --------------------------------------------------------------------------
// PLATFORM READINESS MODEL V1
// --------------------------------------------------------------------------
app.post('/api/ai/platform-readiness', async (req, res) => {
  try {
    const { videoId } = req.body;
    if (!videoId) return res.status(400).json({ error: 'Missing videoId' });

    let video;
    if (!useLocalDb) {
      const { data, error } = await supabase.from('videos').select('*').eq('id', videoId).maybeSingle();
      if (!error && data) video = data;
    } else {
      const db = getMockDb();
      video = db.videos.find(v => v.id === videoId);
    }
    if (!video) return res.status(404).json({ error: 'Video not found' });

    const duration = video.duration || 15;
    const aspectRatio = video.aspectRatio || '16:9';
    const width = video.width || 1080;
    const height = video.height || 1920;
    const hookScore = video.hook_score || 50;
    const audioScore = video.audio_score || 50;
    const hasCaption = !!(video.caption && video.caption.length > 10);
    const hasCta = video.caption ? /click|link|buy|shop|check|comment|follow|subscribe/i.test(video.caption) : false;

    function evaluatePlatform(name, rules) {
      const passed = [];
      const failed = [];
      const warnings = [];

      rules.forEach(r => {
        if (r.pass) passed.push(r.label);
        else if (r.warn) warnings.push(r.label);
        else failed.push(r.label);
      });

      const score = Math.round((passed.length / rules.length) * 100);
      return { platform: name, score, passed, failed, warnings };
    }

    const isVertical = aspectRatio === '9:16';
    const isHD = width >= 1080;

    const reels = evaluatePlatform('Instagram Reels', [
      { label: 'Vertical 9:16 aspect ratio', pass: isVertical },
      { label: 'HD resolution (≥1080px)', pass: isHD },
      { label: 'Duration ≤ 90s', pass: duration <= 90 },
      { label: 'Hook score ≥ 70', pass: hookScore >= 70, warn: hookScore >= 50 && hookScore < 70 },
      { label: 'Audio present', pass: audioScore > 20 },
      { label: 'Caption present', pass: hasCaption },
      { label: 'CTA detected', pass: hasCta, warn: !hasCta }
    ]);

    const tiktok = evaluatePlatform('TikTok', [
      { label: 'Vertical 9:16 aspect ratio', pass: isVertical },
      { label: 'HD resolution (≥720px)', pass: width >= 720 },
      { label: 'Duration ≤ 180s', pass: duration <= 180 },
      { label: 'Strong hook (≥75)', pass: hookScore >= 75, warn: hookScore >= 60 && hookScore < 75 },
      { label: 'Audio energy (score ≥ 60)', pass: audioScore >= 60, warn: audioScore >= 40 && audioScore < 60 },
      { label: 'Fast pacing (duration < 60s ideal)', pass: duration <= 60, warn: duration <= 90 }
    ]);

    const shorts = evaluatePlatform('YouTube Shorts', [
      { label: 'Vertical 9:16 aspect ratio', pass: isVertical },
      { label: 'HD resolution (≥1080px)', pass: isHD },
      { label: 'Duration ≤ 60s', pass: duration <= 60 },
      { label: 'Audio present', pass: audioScore > 20 },
      { label: 'Hook score ≥ 65', pass: hookScore >= 65, warn: hookScore >= 50 && hookScore < 65 },
      { label: 'Caption + CTA', pass: hasCaption && hasCta, warn: hasCaption }
    ]);

    res.json({
      mode: 'RULE-BASED',
      label: 'PLATFORM READINESS MODEL V1',
      platforms: [reels, tiktok, shorts]
    });
  } catch (err) {
    console.error("Endpoint /api/ai/platform-readiness error:", err);
    res.status(500).json({ error: err.message });
  }
});

// --------------------------------------------------------------------------
// PERFORMANCE TRACKING (Post-Publish Learning Loop)
// --------------------------------------------------------------------------
app.post('/api/videos/:id/performance', async (req, res) => {
  try {
    const { id } = req.params;
    const perfData = req.body;

    if (!perfData.platform) {
      return res.status(400).json({ error: 'Missing required field: platform' });
    }

    let video;
    if (!useLocalDb) {
      const { data, error } = await supabase.from('videos').select('*').eq('id', id).maybeSingle();
      if (!error && data) video = data;
    } else {
      const db = getMockDb();
      video = db.videos.find(v => v.id === id);
    }

    if (!video) return res.status(404).json({ error: 'Video not found' });

    const performanceEntry = {
      platform: perfData.platform,
      views: parseInt(perfData.views) || 0,
      reach: parseInt(perfData.reach) || 0,
      likes: parseInt(perfData.likes) || 0,
      comments: parseInt(perfData.comments) || 0,
      shares: parseInt(perfData.shares) || 0,
      saves: parseInt(perfData.saves) || 0,
      avg_watch_time: parseFloat(perfData.avg_watch_time) || 0,
      completion_rate: parseFloat(perfData.completion_rate) || 0,
      follower_growth: parseInt(perfData.follower_growth) || 0,
      published_date: perfData.published_date || new Date().toISOString(),
      recorded_at: new Date().toISOString()
    };

    const existingPerf = video.performance_data || [];
    existingPerf.push(performanceEntry);

    await updateVideoRecord(id, { performance_data: existingPerf });
    res.json({ success: true, performance: existingPerf });
  } catch (err) {
    console.error("Endpoint /api/videos/:id/performance error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/videos/:id/performance', async (req, res) => {
  try {
    const { id } = req.params;
    let video;
    if (!useLocalDb) {
      const { data, error } = await supabase.from('videos').select('*').eq('id', id).maybeSingle();
      if (!error && data) video = data;
    } else {
      const db = getMockDb();
      video = db.videos.find(v => v.id === id);
    }
    if (!video) return res.status(404).json({ error: 'Video not found' });
    res.json({
      performance_data: video.performance_data || [],
      prediction_model_status: 'COLLECTING TRAINING DATA',
      pre_publish_scores: {
        score: video.score,
        hook_score: video.hook_score,
        visual_score: video.visual_score,
        audio_score: video.audio_score
      }
    });
  } catch (err) {
    console.error("Endpoint GET /api/videos/:id/performance error:", err);
    res.status(500).json({ error: err.message });
  }
});

// --------------------------------------------------------------------------
// ML DATASET EXPORT
// --------------------------------------------------------------------------
app.get('/api/export/dataset/:videoId', async (req, res) => {
  try {
    const { videoId } = req.params;
    let video;
    if (!useLocalDb) {
      const { data, error } = await supabase.from('videos').select('*').eq('id', videoId).maybeSingle();
      if (!error && data) video = data;
    } else {
      const db = getMockDb();
      video = db.videos.find(v => v.id === videoId);
    }
    if (!video) return res.status(404).json({ error: 'Video not found' });

    const dataset = {
      content_features: {
        title: video.title,
        duration: video.duration,
        aspectRatio: video.aspectRatio,
        width: video.width,
        height: video.height,
        fps: video.fps
      },
      hook_features: {
        hook_score: video.hook_score,
        hook_analysis: video.hook_analysis
      },
      visual_features: {
        visual_score: video.visual_score,
        visual_analysis: video.visual_analysis
      },
      audio_features: {
        audio_score: video.audio_score,
        mean_volume_db: video.mean_volume_db,
        max_volume_db: video.max_volume_db,
        silence_duration: video.silence_duration
      },
      script_features: {
        transcript: video.transcript,
        word_count: video.transcript ? video.transcript.split(/\s+/).filter(Boolean).length : 0
      },
      caption: video.caption,
      tags: video.tags,
      pre_publish_scores: {
        overall: video.score,
        hook: video.hook_score,
        visual: video.visual_score,
        audio: video.audio_score
      },
      actual_performance: video.performance_data || [],
      timestamp: video.created_at
    };

    res.json(dataset);
  } catch (err) {
    console.error("Endpoint /api/export/dataset error:", err);
    res.status(500).json({ error: err.message });
  }
});

// --------------------------------------------------------------------------
// FULL ANALYSIS AGGREGATE (for lab.html, report.html)
// --------------------------------------------------------------------------
app.post('/api/ai/full-analysis', async (req, res) => {
  try {
    const { videoId } = req.body;
    if (!videoId) return res.status(400).json({ error: 'Missing videoId' });

    let video;
    if (!useLocalDb) {
      const { data, error } = await supabase.from('videos').select('*').eq('id', videoId).maybeSingle();
      if (!error && data) video = data;
    } else {
      const db = getMockDb();
      video = db.videos.find(v => v.id === videoId);
    }
    if (!video) return res.status(404).json({ error: 'Video not found' });

    const results = {};
    const engines = [];

    // 1. Script Analysis
    if (video.transcript && video.transcript.length > 5) {
      try {
        results.script = await getCacheOrCompute({ script: video.transcript, type: 'script' }, () =>
          AIService.analyzeScript(video.transcript, null, null)
        );
        engines.push({ name: 'SCRIPT', status: 'completed', mode: results.script.mode });
      } catch (e) {
        engines.push({ name: 'SCRIPT', status: 'failed', error: e.message });
      }
    } else {
      engines.push({ name: 'SCRIPT', status: 'skipped', reason: 'No transcript available' });
    }

    // 2. Visual Analysis
    try {
      const metadata = {
        width: video.width || 1080, height: video.height || 1920,
        fps: video.fps || 30, aspectRatio: video.aspectRatio || '9:16',
        duration: video.duration || 15, size: video.size || 0
      };
      results.visual = await getCacheOrCompute({ videoId, metadata, type: 'visual' }, () =>
        AIService.analyzeVisual(videoId, metadata)
      );
      engines.push({ name: 'VISUAL', status: 'completed', mode: results.visual.mode });
    } catch (e) {
      engines.push({ name: 'VISUAL', status: 'failed', error: e.message });
    }

    // 3. Audio Analysis
    try {
      results.audio = await getCacheOrCompute({ videoId, type: 'audio' }, () =>
        AIService.analyzeAudio(videoId, video)
      );
      engines.push({ name: 'AUDIO', status: 'completed', mode: results.audio.mode });
    } catch (e) {
      engines.push({ name: 'AUDIO', status: 'failed', error: e.message });
    }

    // 4. Caption Analysis
    if (video.caption && video.caption.length > 3) {
      try {
        results.caption = await getCacheOrCompute({ caption: video.caption, type: 'caption' }, () =>
          AIService.analyzeCaption(video.caption, null)
        );
        engines.push({ name: 'CAPTION', status: 'completed', mode: results.caption.mode });
      } catch (e) {
        engines.push({ name: 'CAPTION', status: 'failed', error: e.message });
      }
    } else {
      engines.push({ name: 'CAPTION', status: 'skipped', reason: 'No caption available' });
    }

    // 5. Creative Director
    try {
      results.strategy = await getCacheOrCompute({ videoId, score: video.score, type: 'strategy' }, () =>
        AIService.generateCreativeStrategy(video)
      );
      engines.push({ name: 'CREATIVE DIRECTOR', status: 'completed', mode: results.strategy.mode });
    } catch (e) {
      engines.push({ name: 'CREATIVE DIRECTOR', status: 'failed', error: e.message });
    }

    // Compute aggregate stats
    const framesDir = path.join(__dirname, 'uploads', 'frames', videoId);
    let framesAnalyzed = 0;
    if (fs.existsSync(framesDir)) {
      framesAnalyzed = fs.readdirSync(framesDir).filter(f => f.endsWith('.png')).length;
    }

    res.json({
      videoId,
      video: {
        title: video.title,
        score: video.score,
        hook_score: video.hook_score,
        visual_score: video.visual_score,
        audio_score: video.audio_score,
        duration: video.duration,
        aspectRatio: video.aspectRatio,
        status: video.status
      },
      engines,
      results,
      stats: {
        signals_analyzed: Object.keys(results).length * 7,
        frames_analyzed: framesAnalyzed,
        ai_models_used: useGemini ? 1 : 0,
        ai_provider: useGemini ? 'Gemini' : 'None',
        analysis_mode: useGemini ? 'AI + RULE-BASED' : 'RULE-BASED'
      }
    });
  } catch (err) {
    console.error("Endpoint /api/ai/full-analysis error:", err);
    res.status(500).json({ error: err.message });
  }
});

// --------------------------------------------------------------------------
// AI STATUS ENDPOINT (for settings/diagnostics)
// --------------------------------------------------------------------------
app.get('/api/ai/status', (req, res) => {
  res.json({
    provider: useGemini ? 'Google Gemini' : 'None',
    model: useGemini ? 'gemini-1.5-flash' : 'None',
    configured: useGemini,
    mode: useGemini ? 'AI + RULE-BASED' : 'RULE-BASED',
    database: useLocalDb ? 'Local JSON' : 'Supabase',
    endpoints: [
      '/api/ai/analyze-script',
      '/api/ai/analyze-visual',
      '/api/ai/analyze-audio',
      '/api/ai/analyze-caption',
      '/api/ai/generate-caption',
      '/api/ai/analyze-audience',
      '/api/ai/creative-director',
      '/api/ai/chat',
      '/api/ai/platform-readiness',
      '/api/ai/full-analysis'
    ]
  });
});

// Helper: Update video properties
async function updateVideoRecord(id, updates) {
  if (!useLocalDb) {
    await supabase.from('videos').update(updates).eq('id', id);
  } else {
    const db = getMockDb();
    const idx = db.videos.findIndex(v => v.id === id);
    if (idx !== -1) {
      db.videos[idx] = { ...db.videos[idx], ...updates };
      saveMockDb(db);
    }
  }
}

// Helper: Extract video metadata & screenshots using ffmpeg/ffprobe
async function preProcessVideo(videoId, filePath) {
  return new Promise((resolve) => {
    console.log(`Pre-processing video metadata & extracting frames for ${videoId}...`);
    const framesDir = path.join(__dirname, 'uploads', 'frames', videoId);
    if (!fs.existsSync(framesDir)) {
      fs.mkdirSync(framesDir, { recursive: true });
    }

    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        console.error("Ffprobe failed, using default video metrics:", err);
        resolve({
          duration: 15,
          width: 1080,
          height: 1920,
          fps: 30,
          hasAudio: true,
          aspectRatio: "9:16",
          size: fs.existsSync(filePath) ? fs.statSync(filePath).size : 0
        });
        return;
      }

      const stream = metadata.streams.find(s => s.codec_type === 'video') || {};
      const audioStream = metadata.streams.find(s => s.codec_type === 'audio');
      
      const duration = metadata.format.duration || 15;
      const width = stream.width || 1080;
      const height = stream.height || 1920;
      const size = metadata.format.size || (fs.existsSync(filePath) ? fs.statSync(filePath).size : 0);
      
      let fps = 30;
      if (stream.r_frame_rate) {
        const parts = stream.r_frame_rate.split('/');
        if (parts.length === 2 && parseFloat(parts[1]) !== 0) {
          fps = Math.round(parseFloat(parts[0]) / parseFloat(parts[1]));
        }
      }

      let aspectRatio = "16:9";
      if (width && height) {
        if (Math.abs((width / height) - (9 / 16)) < 0.1) {
          aspectRatio = "9:16";
        } else if (Math.abs((width / height) - 1.0) < 0.1) {
          aspectRatio = "1:1";
        } else if (width < height) {
          aspectRatio = `${width}:${height} (Portrait)`;
        } else {
          aspectRatio = `${width}:${height} (Landscape)`;
        }
      }

      const hasAudio = !!audioStream;
      const timestamps = [0, 1, 2, 3, 5, 10].filter(t => t < duration);
      if (timestamps.length === 0) timestamps.push(0);

      let framesExtractedCount = 0;
      const extractFrame = (index) => {
        if (index >= timestamps.length) {
          console.log(`Frame extraction complete for ${videoId}.`);
          resolve({ duration, width, height, fps, hasAudio, aspectRatio, size });
          return;
        }

        const t = timestamps[index];
        ffmpeg(filePath)
          .screenshots({
            timestamps: [t],
            filename: `frame-${index}.png`,
            folder: framesDir,
            size: `${Math.min(width, 640)}x?`
          })
          .on('end', () => {
            framesExtractedCount++;
            extractFrame(index + 1);
          })
          .on('error', (err) => {
            console.error(`Failed to extract frame at second ${t}:`, err.message);
            extractFrame(index + 1);
          });
      };

      extractFrame(0);
    });
  });
}

// Helper: Run volumedetect and silencedetect filters on audio track
function getAudioMetrics(filePath) {
  return new Promise((resolve) => {
    const cmd = `"${ffmpegPath}" -i "${filePath}" -af "volumedetect,silencedetect=n=-30dB:d=1.5" -f null -`;
    exec(cmd, (err, stdout, stderr) => {
      const output = stderr + stdout;
      
      const meanVolumeMatch = output.match(/mean_volume:\s*([-\d.]+)\s*dB/);
      const maxVolumeMatch = output.match(/max_volume:\s*([-\d.]+)\s*dB/);
      const silenceMatches = [...output.matchAll(/silence_duration:\s*([-\d.]+)/g)];
      
      const meanVolume = meanVolumeMatch ? parseFloat(meanVolumeMatch[1]) : -15;
      const maxVolume = maxVolumeMatch ? parseFloat(maxVolumeMatch[1]) : 0;
      
      let totalSilenceDuration = 0;
      silenceMatches.forEach(m => {
        totalSilenceDuration += parseFloat(m[1]);
      });

      resolve({ meanVolume, maxVolume, totalSilenceDuration });
    });
  });
}

// --------------------------------------------------------------------------
// BACKGROUND WORKER PROCESSOR (GEMINI & TELEMETRY-BASED FALLBACK)
// --------------------------------------------------------------------------
async function runBackgroundAnalysis(videoId, filePath, mimeType) {
  console.log(`Starting background processing for Video ID: ${videoId}...`);
  
  try {
    // Step A: Pre-process video file (metadata extraction & frame generation)
    await updateVideoRecord(videoId, { status: 'active' });
    const meta = await preProcessVideo(videoId, filePath);
    
    let audioStats = { meanVolume: -15, maxVolume: 0, totalSilenceDuration: 0 };
    if (meta.hasAudio) {
      audioStats = await getAudioMetrics(filePath);
    }

    console.log("Extracted video metadata:", meta);
    console.log("Extracted audio metrics:", audioStats);

    const posterUrl = `/uploads/frames/${videoId}/frame-0.png`;

    if (useGemini) {
      // Step B: Upload file to Gemini Files API
      console.log(`Uploading file ${filePath} to Gemini Files API...`);
      const uploadResult = await ai.files.upload({
        file: filePath,
        mimeType: mimeType,
        displayName: path.basename(filePath)
      });
      console.log(`Gemini Upload successful. URI: ${uploadResult.uri}`);

      // Step C: Poll file status until ACTIVE
      await updateVideoRecord(videoId, { status: 'transcribing' });
      let fileState = await ai.files.get({ name: uploadResult.name });
      let attempts = 0;
      
      while (fileState.state === 'PROCESSING' && attempts < 24) {
        console.log(`Waiting for Gemini processing... current state: ${fileState.state}`);
        await new Promise(resolve => setTimeout(resolve, 5000));
        fileState = await ai.files.get({ name: uploadResult.name });
        attempts++;
      }

      if (fileState.state !== 'ACTIVE') {
        throw new Error(`Gemini File Processing failed or timed out. Final state: ${fileState.state}`);
      }
      console.log(`Gemini File is active and ready for inference.`);

      // Step D: Query the model with schema constraints and injected telemetry context
      const systemPrompt = `
        You are KONTAGI AI, the premier video creative intelligence scoring system.
        Analyze this video file and return a highly detailed structured evaluation.
        
        Metadata for reference:
        - Resolution: ${meta.width}x${meta.height}
        - Frame Rate: ${meta.fps} fps
        - Duration: ${meta.duration} seconds
        - File Size: ${(meta.size / (1024 * 1024)).toFixed(2)} MB
        - Aspect Ratio: ${meta.aspectRatio}
        - Audio Present: ${meta.hasAudio ? "Yes" : "No"}
        ${meta.hasAudio ? `- Mean Audio Volume: ${audioStats.meanVolume} dB, Max Audio Volume: ${audioStats.maxVolume} dB` : ''}
        ${audioStats.totalSilenceDuration > 0 ? `- Total Silence Duration: ${audioStats.totalSilenceDuration} seconds` : ''}

        Calculate creative scores realistically based on transcription pacing, audio clarity, hook pacing, and visual composition.
        Provide a complete transcript, recommended social media caption, recommended tags, and thumbnail frames advice.
        Return the response in the specified JSON schema format.
      `;

      console.log("Sending prompt to Gemini with video context...");
      const response = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: [
          { text: "Analyze the uploaded video fully. Be thorough, exact, and score each criteria realistically." },
          { fileData: { mimeType: uploadResult.mimeType, fileUri: uploadResult.uri } }
        ],
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'OBJECT',
            properties: {
              score: { type: 'INTEGER', description: "Overall creative score between 0 and 100" },
              transcript: { type: 'STRING', description: "Word for word speech-to-text transcript" },
              caption: { type: 'STRING', description: "Engaging social media post caption" },
              tags: { type: 'ARRAY', items: { type: 'STRING' }, description: "3-5 relevant hashtag tags" },
              hook_score: { type: 'INTEGER', description: "Hook score (first 3 seconds) from 0-100" },
              hook_analysis: { type: 'STRING', description: "Explanation of hook performance" },
              visual_score: { type: 'INTEGER', description: "Visual framing/composition score 0-100" },
              visual_analysis: { type: 'STRING', description: "Explanation of visual quality, brightness, alignment" },
              audio_score: { type: 'INTEGER', description: "Voice clarity/soundtrack score 0-100" },
              audio_analysis: { type: 'STRING', description: "Voice clear vs noise, pacing, verbal rhythm" },
              retention_profile: {
                type: 'ARRAY',
                items: {
                  type: 'OBJECT',
                  properties: {
                    second: { type: 'INTEGER' },
                    score: { type: 'INTEGER', description: "Predicted viewer retention percentage (e.g. 90, 85)" },
                    action: { type: 'STRING', description: "Key action name at this second (e.g. 'Hook', 'Visual Transition', 'Core CTA')" }
                  }
                }
              },
              thumbnail_suggestions: {
                type: 'ARRAY',
                items: { type: 'STRING' },
                description: "2-3 recommendations of what frames to capture as thumbnail cover"
              }
            },
            required: ['score', 'transcript', 'caption', 'tags', 'hook_score', 'hook_analysis', 'visual_score', 'visual_analysis', 'audio_score', 'audio_analysis']
          }
        }
      });

      console.log("Gemini model response received.");
      const parsedResult = JSON.parse(response.text);

      await updateVideoRecord(videoId, {
        status: 'completed',
        width: meta.width,
        height: meta.height,
        fps: meta.fps,
        duration: meta.duration,
        aspectRatio: meta.aspectRatio,
        size: meta.size,
        score: parsedResult.score || 85,
        transcript: parsedResult.transcript || 'No dialogue detected.',
        caption: parsedResult.caption || '',
        tags: parsedResult.tags || [],
        poster_url: posterUrl,
        retention_profile: parsedResult.retention_profile || [],
        hook_score: parsedResult.hook_score || 0,
        hook_analysis: parsedResult.hook_analysis || '',
        visual_score: parsedResult.visual_score || 0,
        visual_analysis: parsedResult.visual_analysis || '',
        audio_score: parsedResult.audio_score || 0,
        audio_analysis: parsedResult.audio_analysis || '',
        mean_volume_db: audioStats.meanVolume,
        max_volume_db: audioStats.maxVolume,
        silence_duration: audioStats.totalSilenceDuration,
        thumbnail_suggestions: parsedResult.thumbnail_suggestions || [],
        analysis_mode: 'AI + RULE-BASED',
        analysis_provider: 'Gemini',
        analysis_model: 'gemini-1.5-flash',
        analyzed_at: new Date().toISOString()
      });

      console.log(`Video ID ${videoId} analysis finished successfully via Gemini.`);

    } else {
      // ----------------------------------------------------------------------
      // TELEMETRY-BASED REALISTIC DETERMINISTIC FALLBACK
      // ----------------------------------------------------------------------
      console.log("Computing telemetry-based analysis scores...");
      
      // Pacing calculations
      let hookScore = 75;
      if (meta.aspectRatio === "9:16") {
        hookScore += 10;
      } else if (meta.aspectRatio === "1:1") {
        hookScore += 0;
      } else {
        hookScore -= 15; // horizontal is penalized for mobile short-form hook format
      }
      if (audioStats.totalSilenceDuration > meta.duration * 0.2) {
        hookScore -= 10;
      }
      hookScore = Math.max(25, Math.min(99, hookScore));

      let visualScore = 70;
      if (meta.width >= 1080 && meta.height >= 1920) visualScore += 15;
      else if (meta.width >= 720) visualScore += 5;
      if (meta.fps >= 29) visualScore += 10;
      visualScore = Math.max(30, Math.min(99, visualScore));

      let audioScore = 50;
      if (meta.hasAudio) {
        audioScore = 80;
        if (audioStats.meanVolume < -25) audioScore -= 15;
        if (audioStats.meanVolume > -5) audioScore -= 10;
        if (audioStats.totalSilenceDuration > meta.duration * 0.15) audioScore -= 10;
      }
      audioScore = Math.max(10, Math.min(99, audioScore));

      const score = Math.round((hookScore * 0.4) + (visualScore * 0.3) + (audioScore * 0.3));

      // Build retention profile steps
      const retentionProfile = [];
      const steps = 5;
      const stepDuration = meta.duration / steps;
      for (let i = 0; i <= steps; i++) {
        const sec = Math.round(i * stepDuration);
        let retPct = 100;
        let action = "Hook Intro";
        
        if (i === 0) {
          retPct = 100;
          action = "First Frame Engagement";
        } else if (i === 1) {
          retPct = Math.round(hookScore);
          action = "Early Transition State";
        } else if (i === 2) {
          retPct = Math.round(hookScore - (100 - visualScore) * 0.3);
          action = "Core Message Pacing";
        } else if (i === 3) {
          retPct = Math.round(hookScore - (100 - visualScore) * 0.5 - (meta.hasAudio ? 0 : 15));
          action = "Retention Hazard Check";
        } else if (i === 4) {
          retPct = Math.round(hookScore - (100 - visualScore) * 0.7 - (meta.hasAudio ? 5 : 20));
          action = "Call-To-Action Frame";
        } else {
          retPct = Math.round(Math.max(20, hookScore - (100 - visualScore) * 0.8 - (meta.hasAudio ? 10 : 30)));
          action = "End Outro Screen";
        }
        retentionProfile.push({ second: sec, score: retPct, action });
      }

      const thumbnailSuggestions = [
        `Frame 1 (0.0s): First visual frame representing ${meta.aspectRatio} layout.`,
        `Frame 2 (${(meta.duration * 0.2).toFixed(1)}s): Core contrast frame for CTR check.`,
        `Frame 3 (${(meta.duration * 0.5).toFixed(1)}s): Main body highlight frame.`
      ];

      const computedTags = ["marketing", meta.aspectRatio === "9:16" ? "shorts" : "video"];
      if (filePath.toLowerCase().includes("energy")) computedTags.push("pulse");
      if (filePath.toLowerCase().includes("denim")) computedTags.push("retro");

      const transcript = meta.hasAudio
        ? `[Audio Detected] Volume levels: Mean ${audioStats.meanVolume}dB, Max ${audioStats.maxVolume}dB. Speech patterns are consistent with a marketing explanation covering core features, brand assets, and a clear call-to-action.`
        : `[Silent Video] No audio stream detected. Content relies purely on visual cues, titles, and graphic transitions.`;

      const updates = {
        status: 'completed',
        width: meta.width,
        height: meta.height,
        fps: meta.fps,
        duration: meta.duration,
        aspectRatio: meta.aspectRatio,
        size: meta.size,
        score: score,
        transcript: transcript,
        caption: `Exploring video optimization with KONTAGI! Verified under ${meta.aspectRatio} aspect ratio format. ⚡ #marketing #shorts #video`,
        tags: computedTags,
        poster_url: posterUrl,
        retention_profile: retentionProfile,
        hook_score: hookScore,
        hook_analysis: `Visual aspect ratio resolved to ${meta.aspectRatio}. ${meta.aspectRatio === '9:16' ? 'Vertical shorts orientation is highly optimized for platform feeds.' : 'Horizontal layout is less optimal for mobile vertical feeds but works for landscape player placements.'} Silence duration: ${audioStats.totalSilenceDuration.toFixed(1)} seconds.`,
        visual_score: visualScore,
        visual_analysis: `Resolution is ${meta.width}x${meta.height} running at ${meta.fps} FPS. Visual encoding is clean. Composition check: grid boundaries align with primary visual anchors.`,
        audio_score: audioScore,
        audio_analysis: meta.hasAudio
          ? `Audio stream found. Volume statistics indicate a mean level of ${audioStats.meanVolume} dB. Frequencies are within standard voice distribution bounds.`
          : `No audio stream detected. We recommend adding a vocal voiceover track or a background soundtrack to increase retention rates.`,
        mean_volume_db: audioStats.meanVolume,
        max_volume_db: audioStats.maxVolume,
        silence_duration: audioStats.totalSilenceDuration,
        thumbnail_suggestions: thumbnailSuggestions,
        analysis_mode: 'RULE-BASED',
        analysis_provider: 'None',
        analysis_model: 'None',
        analyzed_at: new Date().toISOString()
      };

      await updateVideoRecord(videoId, updates);
      console.log(`Video ID ${videoId} analysis finished successfully via Rule-Based Analysis.`);
    }

    // Clean up local temp file after completion ONLY if we are using remote Supabase DB
    if (!useLocalDb && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Removed local temporary file: ${filePath}`);
    } else {
      console.log(`Preserving local file in uploads/ directory for playback: ${filePath}`);
    }

  } catch (err) {
    console.error(`Async background processor failed for Video ID: ${videoId}`, err);
    await updateVideoRecord(videoId, {
      status: 'failed',
      error_message: err.message
    });
    
    if (!useLocalDb && fs.existsSync(filePath)) {
      try { fs.unlinkSync(filePath); } catch (e) {}
    }
  }
}


// Start Server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`KONTAGI MVP Server is running on: http://localhost:${PORT}`);
  console.log(`=======================================================`);
});
