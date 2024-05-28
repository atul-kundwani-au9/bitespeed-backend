const contactService = require('../services/contactService');

exports.identify = async (req, res) => {
  const { email, phoneNumber } = req.body;

  try {
    const response = await contactService.identify(email, phoneNumber);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
