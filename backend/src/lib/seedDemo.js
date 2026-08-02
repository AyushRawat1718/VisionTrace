const prisma = require("./prisma");

const DEMO_ASSESSMENT_CODE = process.env.DEMO_ASSESSMENT_CODE;
const DEMO_ASSESSMENT_TITLE = "VisionTrace Public Demo";

/**
 * Ensures a demo assessment with a known, fixed code always exists, so the
 * landing/login page's demo flow (and anyone testing the extension against
 * this deployment) always has something real to join and monitor.
 *
 * Does nothing if DEMO_ASSESSMENT_CODE isn't set — this is left blank in
 * .env.example on purpose so no demo assessment gets created until you
 * intentionally set a code.
 */
async function ensureDemoAssessment() {
  if (!DEMO_ASSESSMENT_CODE) {
    console.log("DEMO_ASSESSMENT_CODE not set — skipping demo assessment seed.");
    return null;
  }

  const existing = await prisma.assessment.findUnique({
    where: { code: DEMO_ASSESSMENT_CODE },
  });

  if (existing) return existing;

  const created = await prisma.assessment.create({
    data: {
      title: DEMO_ASSESSMENT_TITLE,
      code: DEMO_ASSESSMENT_CODE,
      accessType: "OPEN",
    },
  });

  console.log(`Seeded demo assessment "${DEMO_ASSESSMENT_TITLE}" (code: ${DEMO_ASSESSMENT_CODE})`);
  return created;
}

module.exports = { ensureDemoAssessment, DEMO_ASSESSMENT_CODE };
