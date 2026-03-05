import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";

const INFERENCE_URL = "https://models.github.ai/inference";

function getClient() {
  return ModelClient(INFERENCE_URL, new AzureKeyCredential(process.env.GITHUB_TOKEN));
}

// ── Chat Agent (LifeLink emergency assistant) ────────────────────────────────
export async function getChatReply(messages, { maxTokens = 350, temperature = 0.35 } = {}) {
  const client = getClient();
  const response = await client.path("/chat/completions").post({
    body: {
      model: "openai/gpt-4o-mini",
      messages,
      max_tokens: maxTokens,
      temperature,
    },
  });
  if (isUnexpected(response)) throw new Error(response.body.error?.message || "Model API error");
  return response.body.choices[0].message.content.trim();
}

// ── Calling Agent (voice call to emergency contact) ──────────────────────────
export async function getCallingReply(situation, context, conversationHistory) {
  const systemPrompt = `You are LifeLink, an AI emergency voice agent making a phone call in South India.

EMERGENCY SITUATION: ${situation}

ABOUT THE PERSON YOU ARE CALLING: ${context}

RULES:
- First message: introduce yourself as "LifeLink Emergency Service" and state the situation
- Be calm, clear, and urgent — this is a live phone call
- Max 2-3 sentences per response — it's a phone call, not a chat
- No markdown, no lists — natural spoken sentences only
- If they reply in Telugu, Hindi, or Tamil — respond in that language
- If they confirm they're coming/helping — thank them and prepare to end`;

  return getChatReply(
    [{ role: "system", content: systemPrompt }, ...conversationHistory.slice(-10)],
    { maxTokens: 180, temperature: 0.4 }
  );
}

// ── Messaging Agent (AI-generated SMS content) ───────────────────────────────
export async function generateSMSMessage(situation, context, recipientName) {
  const systemPrompt = `You are LifeLink, an AI emergency messaging service in South India.

EMERGENCY SITUATION: ${situation}

ABOUT THE RECIPIENT: ${context}
RECIPIENT NAME: ${recipientName || "contact"}

RULES:
- Write a clear, urgent SMS message
- Start with "LifeLink Emergency Alert:"
- Include the situation and ask for immediate assistance
- Keep it under 160 characters (one SMS)
- No markdown — plain text only
- Be direct and urgent but calm`;

  return getChatReply(
    [
      { role: "system", content: systemPrompt },
      { role: "user", content: "Generate the emergency SMS message now." },
    ],
    { maxTokens: 100, temperature: 0.3 }
  );
}
