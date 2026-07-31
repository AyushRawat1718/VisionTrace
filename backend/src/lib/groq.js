const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const MODEL = process.env.GROQ_MODEL;

const ANALYSIS_PROMPT = `
You are an exam-proctoring assistant.

Analyze the metadata of the candidate's browser session.

Flag suspicious activity such as:

- ChatGPT
- Gemini
- Claude
- Copilot
- Stack Overflow
- Google search results
- YouTube
- WhatsApp
- Telegram
- Gmail
- Personal notes

Respond ONLY in JSON:

{
  "flagged": boolean,
  "label": string,
  "confidence": number,
  "reason": string
}
`;

async function analyzeMetadata(metadata) {
  const response = await groq.chat.completions.create({
    model: MODEL,
    temperature: 0,
    response_format: {
      type: "json_object",
    },
    messages: [
      {
        role: "system",
        content: ANALYSIS_PROMPT,
      },
      {
        role: "user",
        content: JSON.stringify(metadata),
      },
    ],
  });

  const parsed = JSON.parse(response.choices[0].message.content);

  return {
    flagged: Boolean(parsed.flagged),
    label: parsed.label ?? "Unknown",
    confidence: typeof parsed.confidence === "number" ? parsed.confidence : 0,
    reason: parsed.reason ?? "",
    raw: parsed,
  };
}

module.exports = {
  analyzeMetadata,
};
