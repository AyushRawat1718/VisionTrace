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
 * @param {object} metadata - { url, title, openTabs?, ... }
 */
function applyDomainRules(analysis, metadata) {
  const url = metadata?.url || "";
  const activeHit = KNOWN_AI_TOOLS.find((tool) => tool.match.test(url));

  if (activeHit) {
    const modelHadNoOpinion = !analysis.label || analysis.label === "Unknown";

    return {
      ...analysis,
      flagged: true,
      label: modelHadNoOpinion ? activeHit.label : analysis.label,
      confidence: Math.max(analysis.confidence || 0, 0.9),
      reason: modelHadNoOpinion
        ? `Tab URL matches a known AI assistant: ${activeHit.label}`
        : analysis.reason,
    };
  }

  // The active tab is clean, but a known AI tool might still be open in the
  // background. This is a weaker signal than the active-tab case (it's
  // open, not necessarily being used right now), so it gets flagged with
  // lower confidence and a reason that's explicit about the distinction.
  const openTabs = Array.isArray(metadata?.openTabs) ? metadata.openTabs : [];
  const backgroundHit = openTabs
    .filter((tab) => !tab.active)
    .map((tab) => ({
      tab,
      tool: KNOWN_AI_TOOLS.find((t) => t.match.test(tab.url || "")),
    }))
    .find((entry) => entry.tool);

  if (backgroundHit) {
    return {
      ...analysis,
      flagged: true,
      label: `${backgroundHit.tool.label} (background tab)`,
      confidence: Math.max(analysis.confidence || 0, 0.6),
      reason: `${backgroundHit.tool.label} is open in another tab, though not the active one.`,
    };
  }

  return analysis;
}

module.exports = { applyDomainRules };
