const prisma = require("../lib/prisma");

async function createEvent(req, res) {
  try {
    const { attemptId, type, metadata } = req.body;

    if (!attemptId || !type) {
      return res.status(400).json({
        success: false,
        message: "attemptId and type are required",
      });
    }

    const allowedTypes = ["TAB_SWITCH", "FULLSCREEN_EXIT", "COPY", "PASTE"];

    if (!allowedTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event type",
      });
    }

    const attempt = await prisma.attempt.findUnique({
      where: {
        id: attemptId,
      },
    });

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: "Attempt not found",
      });
    }

    await prisma.event.create({
      data: {
        type,
        metadata,
        attemptId,
      },
    });

    return res.status(201).json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

module.exports = {
  createEvent,
};
