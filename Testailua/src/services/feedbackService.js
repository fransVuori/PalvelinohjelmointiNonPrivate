const prisma = require('../utils/prisma');

const submitFeedback = async (name, email, message) => {
  const feedback = await prisma.feedback.create({
    data: {
      name,
      email,
      message,
    },
  });
  return feedback;
};

module.exports = {
  submitFeedback,
};
