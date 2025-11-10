const feedbackService = require('../services/feedbackService');

const submitFeedback = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;
    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }
    const feedback = await feedbackService.submitFeedback(name, email, message);
    res.status(201).json(feedback);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitFeedback,
};
