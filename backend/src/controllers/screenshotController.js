const prisma = require("../lib/prisma");
const { uploadScreenshot } = require("../lib/cloudinary");
const { analyzeMetadata } = require("../lib/groq");

async function createScreenshot(req, res) {
  try {
    const { attemptId, image, metadata } = req.body;

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
      timestamp: new Date().toISOString(),
    };

    const [uploadResult, analysis] = await Promise.all([
      uploadScreenshot(image, attemptId),

      analyzeMetadata(safeMetadata).catch((error) => {
        console.error("Groq analysis failed:", error);

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

    const screenshot = await prisma.screenshot.create({
      data: {
        imageUrl: uploadResult.url,
        publicId: uploadResult.publicId,

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
