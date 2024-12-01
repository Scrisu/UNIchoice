// Chatbot Toggle Logic
document.addEventListener('DOMContentLoaded', () => {
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatWidget = document.getElementById('chat-widget');
    const chatInput = document.getElementById('chat-input');
    const sendMessage = document.getElementById('send-message');
    const chatboxMessages = document.getElementById('chatbox-messages');

    // Show/Hide Chat Widget
    chatbotToggle.addEventListener('click', () => {
        const isDisplayed = chatWidget.style.display === 'block';
        chatWidget.style.display = isDisplayed ? 'none' : 'block';
    });

    // Send Message to Chatbot
    sendMessage.addEventListener('click', async () => {
        const message = chatInput.value.trim();
        if (!message) return;

        // Append user's message to chat
        const userMessage = document.createElement('div');
        userMessage.textContent = message;
        userMessage.classList.add('message', 'user-message');
        chatboxMessages.appendChild(userMessage);

        chatInput.value = ''; // Clear input field

        // Send the user's message to the chatbot API
        try {
            const response = await fetch('/api/chatbot/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message }),
            });
            const data = await response.json();

            // Append bot's response to chat
            const botMessage = document.createElement('div');
            botMessage.textContent = data.response || 'Îmi pare rău, nu am înțeles.';
            botMessage.classList.add('message', 'bot-message');
            chatboxMessages.appendChild(botMessage);

            // Scroll to Bottom
            chatboxMessages.scrollTop = chatboxMessages.scrollHeight;
        } catch (error) {
            console.error('Error:', error);

            const botMessage = document.createElement('div');
            botMessage.textContent = 'A apărut o problemă. Te rog încearcă din nou!';
            botMessage.classList.add('message', 'bot-message');
            chatboxMessages.appendChild(botMessage);
        }
    });

    // Allow sending messages with Enter key
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage.click();
        }
    });
});
