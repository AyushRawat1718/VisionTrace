const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const MODEL = process.env.GEMINI_MODEL;

const ANALYSIS_PROMPT = `
You are an exam-proctoring assistant reviewing a screenshot of a candidate's browser during an online assessment.

Look at the actual screenshot content—not just the tab title—for signs of prohibited resources:

- AI chat tools (ChatGPT, Gemini, Claude, Copilot, etc.)
- Search engine results with answers
- Video sites unrelated to the assessment
- Personal notes, messaging apps, email, or documents
- Copied or pasted AI-generated text
- Any content unrelated to a normal assessment page

The tab metadata (title, URL, timestamp) is supplementary context only.

Respond ONLY with valid JSON:

{
  "flagged": boolean,
  "label": string,
  "confidence": number,
  "reason": string
}
`;

async function analyzeScreenshot(base64Image, metadata = {}) {
  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `${ANALYSIS_PROMPT}

Tab metadata:

${JSON.stringify(metadata, null, 2)}
`,
            },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: base64Image.replace(/^data:image\/\w+;base64,/, ""),
              },
            },
          ],
        },
      ],
      config: {
        temperature: 0,
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text);

    return {
      flagged: Boolean(parsed.flagged),
      label: parsed.label ?? "Unknown",
      confidence: typeof parsed.confidence === "number" ? parsed.confidence : 0,
      reason: parsed.reason ?? "",
      raw: parsed,
    };
  } catch (error) {
    console.error("Gemini analysis failed:", error);

    return {
      flagged: false,
      label: "Analysis Failed",
      confidence: 0,
      reason: "Gemini could not analyze the screenshot.",
      raw: null,
    };
  }
}

module.exports = {
  analyzeScreenshot,
};
