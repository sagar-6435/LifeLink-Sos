import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { getChatReply } from "./agent.js";
import { triggerCall } from "./CallingController.js";
import { sendSMS } from "./MessagingController.js";

// ── Emergency Config ─────────────────────────────────────────────────────────
// Fallback number used by the AI chat keyword-trigger (no userId available here).
// For explicit SOS with user contacts use POST /api/sos instead.
const EMERGENCY_CONTACT = "+917330873455";

const EMERGENCY_KEYWORDS = [
  // English
  "injured", "hurt", "bleeding", "accident", "crash", "fell", "fallen",
  "help", "need help", "emergency", "attack", "heart attack", "unconscious",
  "not breathing", "choking", "drowning", "stroke", "seizure", "snake bite",
  "harassed", "stalked", "unsafe", "danger", "threatened", "assaulted",
  "fire", "burning", "trapped", "pain", "severe pain", "dying", "fainted",
  "i am hurt", "i got hurt", "i need help", "please help", "save me",
  "cannot breathe", "can't breathe", "chest pain",
  // Telugu
  "సహాయం", "నొప్పి", "ప్రమాదం", "గాయపడ్డాను",
  // Hindi
  "help karo", "bachao", "madad", "dard", "chot lagi",
  // Tamil
  "உதவி", "காயம்", "ஆபத்து",
];

function isEmergency(message) {
  const lower = message.toLowerCase();
  return EMERGENCY_KEYWORDS.some(kw => lower.includes(kw));
}

function buildSituation(message, history) {
  const userMessages = [
    ...history.filter(m => m.role === "user").map(m => m.content),
    message,
  ].slice(-4).join(" | ");
  return userMessages.length > 300 ? userMessages.slice(0, 300) + "..." : userMessages;
}

async function triggerEmergencyServices(situation) {
  const results = { message: null, call: null };
  const ctx = "Emergency contact of the person in distress. They need immediate assistance.";

  try {
    console.log(`\n🚨 [Emergency] Sending SMS to ${EMERGENCY_CONTACT}...`);
    results.message = await sendSMS(EMERGENCY_CONTACT, situation, ctx, "Emergency Contact");
    console.log(`✅ [Emergency] SMS sent — SID: ${results.message.messageSid}`);
  } catch (err) {
    console.error("❌ [Emergency] SMS failed:", err.message);
    results.message = { error: err.message };
  }

  try {
    console.log(`📞 [Emergency] Placing call to ${EMERGENCY_CONTACT}...`);
    results.call = await triggerCall(EMERGENCY_CONTACT, situation, ctx);
    console.log(`✅ [Emergency] Call placed — SID: ${results.call.callSid}`);
  } catch (err) {
    console.error("❌ [Emergency] Call failed:", err.message);
    results.call = { error: err.message };
  }

  return results;
}

// ── Language Detection ───────────────────────────────────────────────────────
export function detectLanguage(text) {
  if (/[\u0C00-\u0C7F]/.test(text)) return { code: "te-IN", name: "Telugu" };
  if (/[\u0B80-\u0BFF]/.test(text)) return { code: "ta-IN", name: "Tamil" };
  if (/[\u0C80-\u0CFF]/.test(text)) return { code: "kn-IN", name: "Kannada" };
  if (/[\u0900-\u097F]/.test(text)) return { code: "hi-IN", name: "Hindi" };
  return { code: "en-IN", name: "English" };
}

// ── System Prompt ────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are LifeLink — a calm, authoritative AI emergency response agent for South India.
You assist with:
1. ROAD ACCIDENTS — first aid guidance, ambulance coordination, bystander help
2. HEALTH CRISES — heart attack, stroke, seizure, choking, drowning, snake bite
3. WOMEN'S SAFETY — harassment, assault, stalking, unsafe situations

CRITICAL RULES:
- Always respond in the SAME LANGUAGE the user speaks (Telugu, Tamil, Kannada, Hindi, or English)
- Be CALM, CLEAR, AUTHORITATIVE — you are their lifeline right now
- Give step-by-step instructions, most critical action FIRST
- Always include relevant emergency numbers when appropriate:
  * Ambulance / Medical: 108
  * Police: 100
  * Women's Helpline: 1091
  * Fire: 101
  * National Emergency: 112
- Keep responses SHORT (2-4 sentences) — this is a real-time voice interface
- If someone is in immediate danger, begin with the single most critical action
- For Telugu: respond in fluent Telugu script
- You have a warm, trustworthy South Indian personality — never robotic, never panicked`;

// ── POST /api/chat ───────────────────────────────────────────────────────────
export async function chat(req, res) {
    
  const { message, history = [], emergencyAlreadyTriggered = false } = req.body;
  if (!message) return res.status(400).json({ error: "No message provided" });

  const detectedInputLang = detectLanguage(message);
  const emergencyDetected = !emergencyAlreadyTriggered && isEmergency(message);

  try {
    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...history.slice(-8),
      { role: "user", content: message },
    ];

    // Fire AI reply and emergency services in parallel
    const [reply, emergencyActions] = await Promise.all([
      getChatReply(messages),
      emergencyDetected
        ? triggerEmergencyServices(buildSituation(message, history))
        : Promise.resolve(null),
    ]);

    const replyLang = detectLanguage(reply);

    if (emergencyDetected) {
      console.log(`\n🆘 Emergency triggered for: "${message.slice(0, 60)}"\n`);
    }

    res.json({
      reply,
      detectedInputLang,
      replyLang,
      emergencyTriggered: emergencyDetected,
      emergencyActions,
    });
  } catch (err) {
    console.error("Chat error:", err.message);
    res.status(500).json({
      error: "Agent temporarily unavailable.",
      fallback: "Please call 112 for immediate emergency assistance.",
    });
  }
}

// ── POST /api/speak ──────────────────────────────────────────────────────────
export async function speak(req, res) {
  const { text, lang } = req.body;
  if (!text) return res.status(400).json({ error: "No text provided" });

  const voiceMap = {
    "te-IN": "te-IN-ShrutiNeural",
    "ta-IN": "ta-IN-PallaviNeural",
    "kn-IN": "kn-IN-SapnaNeural",
    "hi-IN": "hi-IN-SwaraNeural",
    "en-IN": "en-IN-NeerjaNeural",
  };

  const voiceName = voiceMap[lang] || "en-IN-NeerjaNeural";

  try {
    const speechConfig = sdk.SpeechConfig.fromSubscription(
      process.env.AZURE_SPEECH_KEY,
      process.env.AZURE_SPEECH_REGION
    );
    speechConfig.speechSynthesisVoiceName = voiceName;
    speechConfig.speechSynthesisOutputFormat =
      sdk.SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3;

    const synthesizer = new sdk.SpeechSynthesizer(speechConfig, null);

    synthesizer.speakTextAsync(
      text,
      (result) => {
        synthesizer.close();
        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
          const buf = Buffer.from(result.audioData);
          res.set("Content-Type", "audio/mpeg");
          res.set("Content-Length", buf.length);
          res.send(buf);
        } else {
          console.error("TTS failed:", result.errorDetails);
          res.status(500).json({ error: "Speech synthesis failed" });
        }
      },
      (err) => {
        synthesizer.close();
        console.error("TTS exception:", err);
        res.status(500).json({ error: "Speech service error" });
      }
    );
  } catch (err) {
    console.error("Speak error:", err);
    res.status(500).json({ error: "Speech service unavailable" });
  }
}

// ── GET /api/speech-token ────────────────────────────────────────────────────
export async function speechToken(req, res) {
  try {
    const response = await fetch(
      `${process.env.AZURE_ENDPOINT}sts/v1.0/issueToken`,
      {
        method: "POST",
        headers: {
          "Ocp-Apim-Subscription-Key": process.env.AZURE_SPEECH_KEY,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    if (!response.ok) throw new Error("Token fetch failed: " + response.status);
    const token = await response.text();
    res.json({ token, region: process.env.AZURE_SPEECH_REGION });
  } catch (err) {
    console.error("Speech token error:", err);
    res.status(500).json({ error: "Failed to get speech token" });
  }
}
