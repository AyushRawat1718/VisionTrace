const prisma = require("../lib/prisma");

// GET /api/dashboard/assessments
async function listAssessments(req, res) {
  try {
    const assessments = await prisma.assessment.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { attempts: true } },
      },
    });

    return res.status(200).json({
      success: true,
      assessments: assessments.map((a) => ({
        id: a.id,
        title: a.title,
        code: a.code,
        accessType: a.accessType,
        createdAt: a.createdAt,
        attemptCount: a._count.attempts,
      })),
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

// GET /api/dashboard/assessments/:id/attempts
async function listAttempts(req, res) {
  try {
    const { id } = req.params;

    const attempts = await prisma.attempt.findMany({
      where: { assessmentId: id },
      orderBy: { startedAt: "desc" },
      include: {
        _count: { select: { events: true, screenshots: true } },
        screenshots: {
          where: { flagged: true },
          select: { id: true },
        },
      },
    });

    return res.status(200).json({
      success: true,
      attempts: attempts.map((attempt) => ({
        id: attempt.id,
        name: attempt.name,
        email: attempt.email,
        startedAt: attempt.startedAt,
        eventCount: attempt._count.events,
        screenshotCount: attempt._count.screenshots,
        flaggedScreenshotCount: attempt.screenshots.length,
      })),
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

// GET /api/dashboard/attempts/:id/timeline
async function getAttemptTimeline(req, res) {
  try {
    const { id } = req.params;

    const attempt = await prisma.attempt.findUnique({
      where: { id },
      include: {
        assessment: { select: { title: true, code: true } },
        events: { orderBy: { createdAt: "asc" } },
        screenshots: { orderBy: { createdAt: "asc" } },
      },
    });

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: "Attempt not found",
      });
    }

    const timeline = [
      ...attempt.events.map((e) => ({
        kind: "event",
        type: e.type,
        metadata: e.metadata,
        createdAt: e.createdAt,
      })),
      ...attempt.screenshots.map((s) => ({
        kind: "screenshot",
        imageUrl: s.imageUrl,
        flagged: s.flagged,
        label: s.label,
        confidence: s.confidence,
        reason: s.reason,
        createdAt: s.createdAt,
      })),
    ].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    return res.status(200).json({
      success: true,
      attempt: {
        id: attempt.id,
        name: attempt.name,
        email: attempt.email,
        startedAt: attempt.startedAt,
        assessment: attempt.assessment,
      },
      timeline,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

module.exports = { listAssessments, listAttempts, getAttemptTimeline };
