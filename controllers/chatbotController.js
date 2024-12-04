const { NlpManager } = require('node-nlp');

// Initialize NLP Manager for Romanian
const manager = new NlpManager({ languages: ['ro'] }); // 'ro' for Romanian
// In-memory context storage (use Redis/Database in production for scalability)
const userContexts = {};

/**
 * Process user input and manage context.
 * @param {string} userInput - The input from the user.
 * @param {string} userId - Unique identifier for the user (e.g., session or user ID).
 * @returns {Promise<string>} - The bot's response.
 */

// Add Training Data (Intents and Responses)
manager.addDocument('ro', 'salut', 'greeting.hello');
manager.addDocument('ro', 'bună', 'greeting.hello');
manager.addDocument('ro', 'buna', 'greeting.hello');
manager.addDocument('ro', 'ce mai faci', 'greeting.howareyou');
manager.addDocument('ro', 'cine ești', 'bot.identity');
manager.addDocument('ro', 'cine esti', 'bot.identity');
manager.addDocument('ro', 'cum te cheamă', 'bot.name');
manager.addDocument('ro', 'mulțumesc', 'greeting.thanks');
manager.addDocument('ro', 'multumesc', 'greeting.thanks');
manager.addDocument('ro', 'mersi', 'greeting.thanks');
manager.addDocument('ro', 'la revedere', 'greeting.goodbye');

manager.addDocument('ro', 'bine', 'bine.bine');
manager.addAnswer('ro', 'bine.bine', 'Bine si din partea mea. Te pot ajuta cu altceva?');

manager.addAnswer('ro', 'greeting.hello', 'Salut! Cu ce te pot ajuta?');
manager.addAnswer('ro', 'greeting.howareyou', 'Sunt un bot, dar mă descurc bine! Cu ce te pot ajuta?');
manager.addAnswer('ro', 'bot.name', 'Mă cheamă Mugurel.');
manager.addAnswer('ro', 'bot.identity', 'Sunt Mugurel.');
manager.addAnswer('ro', 'greeting.thanks', 'Cu plăcere!');
manager.addAnswer('ro', 'greeting.goodbye', 'La revedere! O zi bună!');

// University Recommendations Intent (Romanian)
manager.addDocument('ro', 'Ce universitate ar trebui să aleg?', 'university.recommend');
manager.addDocument('ro', 'Am nevoie de ajutor pentru a alege o universitate.', 'university.recommend');
manager.addDocument('ro', 'Care este cea mai bună universitate pentru inginerie?', 'university.recommend');
manager.addDocument('ro', 'Ajută-mă să găsesc o universitate.', 'university.recommend');
manager.addDocument('ro', 'Ce universitate îmi recomanzi?', 'university.recommend');
manager.addDocument('ro', 'Poți să îmi sugerezi o universitate?', 'university.recommend');
manager.addDocument('ro', 'Poți să îmi sugerezi o universitate buna?', 'university.recommend');

manager.addDocument('ro', 'informatii despre universitate', 'university.info');
manager.addDocument('ro', 'informatii despre universitati', 'university.info');
manager.addDocument('ro', 'unde gasesc informatii despre universitate universitatea', 'university.info');





// Quiz Assistance Intent (Romanian)
manager.addDocument('ro', 'Vreau să fac quiz-ul pentru universitate', 'quiz.assistance');
manager.addDocument('ro', 'Mă poți ajuta cu quiz-ul?', 'quiz.assistance');
manager.addDocument('ro', 'Cum pot face quiz-ul pentru a găsi universitatea potrivită?', 'quiz.assistance');
manager.addDocument('ro', 'Unde este quiz-ul pentru alegerea universității?', 'quiz.assistance');
manager.addDocument('ro', 'Ajută-mă să încep quiz-ul pentru universitate.', 'quiz.assistance');
manager.addDocument('ro', 'detalii despre quiz.', 'quiz.assistance');

manager.addAnswer('ro', 'quiz.assistance', 'Pentru a găsi universitatea ideală pentru tine, accesează quiz-ul nostru: www.choose-uni.com/quiz');

// Train the Model
async function trainBot() {
    try {
        console.log('Training the NLP model...');
        await manager.train();
        console.log('NLP model trained successfully!');
        manager.save(); // Save the trained model (optional)
    } catch (error) {
        console.error('Error during training:', error);
    }
}

// Train on startup
(async () => {
    await trainBot();
})();

/**
 * Get Bot Response with Context Handling
 * @param {string} userInput - The user's input message.
 * @param {string} userId - Unique identifier for the user (e.g., session ID).
 * @returns {Promise<string>} - The bot's response.
 */
async function getBotResponse(userInput, userId = 'default') {
    try {
        // Ensure user context exists
        if (!userContexts[userId]) {
            userContexts[userId] = { context: {} };
        }

        const userContext = userContexts[userId].context;

        // Process user input with current context
        const response = await manager.process('ro', userInput, userContext);

        // Update context with the response context
        userContexts[userId].context = response.context || {};

        // Custom handling for intents
        if (response.intent === 'university.recommend') {
            // Always redirect to the quiz for university recommendations
            return `Pentru a găsi universitatea potrivită, îți recomand să faci quiz-ul nostru: www.choose-uni.com/quiz`;
        }

        if (response.intent === 'university.info') {
            // Always redirect to the quiz for university recommendations
            return `Pentru a găsi mai multe informatii despre universitati, poti accesa pagina noastra de facultati www.choose-uni.com/facultati`;
        }


        // Fallback for unrecognized input
        if (response.intent === 'None') {
            return "Îmi pare rău, încă nu m-a învățat Domnul Greavu cum să răspund. Poți încerca să mă întrebi altceva";
        }

        // Return the bot's default response for recognized intents
        return response.answer || "Îmi pare rău, încă nu m-a învățat Domnul Greavu cum să răspund. Poți încerca să mă întrebi altceva";
    } catch (error) {
        console.error('Error processing user input:', error);
        return "A apărut o eroare. Te rog încearcă din nou.";
    }
}


module.exports = { getBotResponse };
