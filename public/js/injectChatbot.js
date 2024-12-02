document.addEventListener('DOMContentLoaded', () => {
    // Chatbot Markup
    const chatbotHtml = `
        <div id="chatbot-container">
            <!-- Chatbot Button -->
            <button id="chatbot-toggle">
                <img id="chatbot-icon" src="/images/mugurel.png" alt="Chatbot Icon"> Cere-i ajutor lui Mugurel
            </button>

            <!-- Chat Widget (Hidden by Default) -->
            <div id="chat-widget" style="display: none;">
                <div id="chatbot-header">
                    <img id="chatbot-icon-header" src="/images/mugurel.png" alt="Chatbot Icon"> Mugurel
                </div>
                <div id="chatbox-messages">
                    <!-- Chat Messages -->
                </div>
                <div class="input-area">
                    <input id="chat-input" type="text" placeholder="Scrie un mesaj..." />
                    <button id="send-message">Trimite</button>
                </div>
            </div>
        </div>
    `;

    // Append Chatbot to Body
    document.body.insertAdjacentHTML('beforeend', chatbotHtml);

    // Initialize Chatbot Logic
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

        const userMessage = document.createElement('div');
        userMessage.textContent = message;
        userMessage.classList.add('message', 'user-message');
        chatboxMessages.appendChild(userMessage);

        chatInput.value = '';

        try {
            const response = await fetch('/api/chatbot/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message }),
            });
            const data = await response.json();

            const botMessage = document.createElement('div');
            botMessage.textContent = data.response || 'Îmi pare rău, nu am înțeles.';
            botMessage.classList.add('message', 'bot-message');
            chatboxMessages.appendChild(botMessage);

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
const chatbotStyles = document.createElement('link');
chatbotStyles.rel = 'stylesheet';
chatbotStyles.href = '/css/chatbot.css';
document.head.appendChild(chatbotStyles);
