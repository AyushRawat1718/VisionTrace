const prisma = require("../lib/prisma");
const { uploadScreenshot } = require("../lib/cloudinary");
const { analyzeScreenshot } = require("../lib/gemini");
const { applyDomainRules } = require("../lib/domainRules");

async function createScreenshot(req, res) {
  try {
    const {
      attemptId,
      image,
      metadata,
      type = "PERIODIC",
      trigger = "TIMER",
    } = req.body;

    if (!attemptId || !image) {
      return res.status(400).json({
        success: false,
        message: "attemptId and image are required",
      });
    }

    const attempt = await prisma.attempt.findUnique({
      where: { id: attemptId },
    });

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: "Attempt not found",
      });
    }

    const safeMetadata = {
      title: metadata?.title || "Unknown",
      url: metadata?.url || "Unknown",
      events: metadata?.events || [],
      timestamp: metadata?.timestamp || new Date().toISOString(),
      openTabs: Array.isArray(metadata?.openTabs) ? metadata.openTabs : [],
    };

    const [uploadResult, rawAnalysis] = await Promise.all([
      uploadScreenshot(image, attemptId),

      analyzeScreenshot(image, safeMetadata).catch((error) => {
        console.error("Gemini analysis failed:", error);

        return {
          flagged: false,
          label: "Unknown",
          confidence: 0,
          reason: "AI analysis unavailable",
          raw: {
            error: "analysis_failed",
            details: error.message,
          },
        };
      }),
    ]);

    // Known-domain backstop: guarantees flagging for unambiguous AI-tool
    // URLs even if the vision call above failed or missed it.
    const analysis = applyDomainRules(rawAnalysis, safeMetadata);

    const screenshot = await prisma.screenshot.create({
      data: {
        imageUrl: uploadResult.url,
        publicId: uploadResult.publicId,

        type,
        trigger,

        flagged: analysis.flagged,
        label: analysis.label,
        confidence: analysis.confidence,
        reason: analysis.reason,

        rawAnalysis: {
          ...analysis.raw,
          metadata: safeMetadata,
        },

        attemptId,
      },
    });

    if (analysis.flagged) {
      console.log(
        `[SUSPICIOUS][${new Date().toISOString()}] Attempt ${attemptId}: ${analysis.label} (${analysis.confidence}) — ${analysis.reason}`,
      );
    }

    return res.status(201).json({
      success: true,
      screenshot: {
        id: screenshot.id,
        imageUrl: screenshot.imageUrl,

        type: screenshot.type,
        trigger: screenshot.trigger,

        flagged: screenshot.flagged,
        label: screenshot.label,
        confidence: screenshot.confidence,
        reason: screenshot.reason,
        createdAt: screenshot.createdAt,
      },
    });
  } catch (error) {
    console.error("Screenshot upload failed:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

module.exports = {
  createScreenshot,
};
