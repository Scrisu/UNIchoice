const express = require('express');
const { getBotResponse } = require('../controllers/chatbotController');
const router = express.Router();

router.post('/chat', async (req, res) => {
    const { message } = req.body;

    // Validate the input message
    if (!message || typeof message !== 'string') {
        return res.status(400).send({ error: 'Invalid request. "message" field is required.' });
    }

    try {
        const response = await getBotResponse(message);
        res.status(200).send({ response });
    } catch (error) {
        console.error('Error during chatbot response:', error);
        res.status(500).send({ error: 'Something went wrong!' });
    }
});

module.exports = router;
