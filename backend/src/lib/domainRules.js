// Deterministic backstop for known AI-assistant domains. This doesn't
// replace the vision model's judgment — it complements it: the model is
// what catches pasted content, ambiguous cases, and anything not on this
// list, while this gives a guaranteed-correct floor for the exact tools
// that are unambiguously prohibited, even if the vision call fails or the
// model happens to miss it.
const KNOWN_AI_TOOLS = [
  { match: /chat\.openai\.com|chatgpt\.com/i, label: "ChatGPT" },
  { match: /gemini\.google\.com|bard\.google\.com/i, label: "Google Gemini" },
  { match: /claude\.ai/i, label: "Claude" },
  { match: /copilot\.microsoft\.com/i, label: "Microsoft Copilot" },
  { match: /perplexity\.ai/i, label: "Perplexity" },
  { match: /character\.ai/i, label: "Character.AI" },
  { match: /poe\.com/i, label: "Poe" },
  { match: /you\.com/i, label: "You.com" },
];

/**
 * @param {object} analysis - result from analyzeScreenshot() (possibly the
 *   "AI analysis unavailable" fallback if that call failed)
 * @param {object} metadata - { url, title, ... }
 */
function applyDomainRules(analysis, metadata) {
  const url = metadata?.url || "";
  const hit = KNOWN_AI_TOOLS.find((tool) => tool.match.test(url));

  if (!hit) return analysis;

  const modelHadNoOpinion = !analysis.label || analysis.label === "Unknown";

  return {
    ...analysis,
    flagged: true,
    label: modelHadNoOpinion ? hit.label : analysis.label,
    confidence: Math.max(analysis.confidence || 0, 0.9),
    reason: modelHadNoOpinion
      ? `Tab URL matches a known AI assistant: ${hit.label}`
      : analysis.reason,
  };
}

module.exports = { applyDomainRules };
