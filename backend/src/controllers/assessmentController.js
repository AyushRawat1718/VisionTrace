const prisma = require("../lib/prisma");

function generateCode(length = 6) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  let code = "";

  for (let i = 0; i < length; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }

  return code;
}

async function generateUniqueCode() {
  let code;
  let exists = true;

  while (exists) {
    code = generateCode();

    const assessment = await prisma.assessment.findUnique({
      where: {
        code,
      },
    });

    exists = !!assessment;
  }

  return code;
}

const createAssessment = async (req, res) => {
  try {
    const { title, accessType = "OPEN", emails = [] } = req.body;

    if (accessType === "RESTRICTED" && emails.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Restricted assessments must contain at least one email",
      });
    }

    const code = await generateUniqueCode();

    const assessment = await prisma.assessment.create({
      data: {
        title,
        code,
        accessType,

        allowedUsers: {
          create:
            accessType === "RESTRICTED"
              ? emails.map((email) => ({
                  email,
                }))
              : [],
        },
      },
    });

    return res.status(201).json({
      success: true,
      assessment: {
        id: assessment.id,
        title: assessment.title,
        code: assessment.code,
        accessType: assessment.accessType,
        createdAt: assessment.createdAt,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const joinAssessment = async (req, res) => {
  try {
    const { code, email } = req.body;

    const assessment = await prisma.assessment.findUnique({
      where: {
        code,
      },

      include: {
        allowedUsers: true,
      },
    });

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: "Invalid assessment code",
      });
    }

    if (assessment.accessType === "RESTRICTED") {
      const allowed = assessment.allowedUsers.some(
        (user) => user.email === email,
      );

      if (!allowed) {
        return res.status(403).json({
          success: false,
          message: "You are not allowed to take this assessment",
        });
      }
    }

    return res.status(200).json({
      success: true,
      assessment: {
        title: assessment.title,
        accessType: assessment.accessType,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

module.exports = {
  createAssessment,
  joinAssessment,
};
