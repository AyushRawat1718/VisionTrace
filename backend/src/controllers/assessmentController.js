function generateCode(length = 6) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  let code = "";

  for (let i = 0; i < length; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }

  return code;
}

const createAssessment = (req, res) => {
  const { title } = req.body;

  const assessment = {
    id: Date.now(),
    title,
    code: generateCode(),
  };

  return res.status(201).json(assessment);
};

module.exports = {
  createAssessment,
};
