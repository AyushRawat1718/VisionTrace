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
    // Generate a random code
    code = generateCode();

    // Check if the code already exists in the database
    const assessment = await prisma.assessment.findUnique({
      where: {
        code,
      },
    });

    // Convert assessment to true/false
    exists = !!assessment;
  }

  return code;
}

const createAssessment = async (req, res) => {
  try {
    const { title } = req.body;

    // Generate a unique code
    const code = await generateUniqueCode();

    // Create the assessment
    const assessment = await prisma.assessment.create({
      data: {
        title,
        code,
      },
    });

    return res.status(201).json(assessment);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

module.exports = {
  createAssessment,
};
