const { NlpManager } = require('node-nlp');

// Initialize NLP Manager for Romanian
const manager = new NlpManager({ languages: ['ro'] }); // 'ro' for Romanian

// Add Training Data (Intents and Responses)
manager.addDocument('ro', 'salut', 'greeting.hello');
manager.addDocument('ro', 'bună', 'greeting.hello');
manager.addDocument('ro', 'ce mai faci', 'greeting.howareyou');
manager.addDocument('ro', 'cine ești', 'bot.identity');
manager.addDocument('ro', 'cum te cheamă', 'bot.name');
manager.addDocument('ro', 'mulțumesc', 'greeting.thanks');
manager.addDocument('ro', 'mersi', 'greeting.thanks');
manager.addDocument('ro', 'la revedere', 'greeting.goodbye');

manager.addAnswer('ro', 'greeting.hello', 'Salut! Cu ce te pot ajuta?');
manager.addAnswer('ro', 'greeting.howareyou', 'Sunt un bot, dar mă descurc bine! Tu ce mai faci?');
manager.addAnswer('ro', 'bot.name', 'Mă cheamă Chatbot-ul tău prietenos.');
manager.addAnswer('ro', 'bot.identity', 'Sunt un chatbot creat cu NLP.js.');
manager.addAnswer('ro', 'greeting.thanks', 'Cu plăcere!');
manager.addAnswer('ro', 'greeting.goodbye', 'La revedere! O zi bună!');

// University Recommendations Intent (Romanian)
manager.addDocument('ro', 'Îmi poți recomanda o universitate bună?', 'university.recommend');
manager.addDocument('ro', 'Ce universitate ar trebui să aleg?', 'university.recommend');
manager.addDocument('ro', 'Am nevoie de ajutor pentru a alege o universitate.', 'university.recommend');
manager.addDocument('ro', 'Care este cea mai bună universitate pentru inginerie?', 'university.recommend');
manager.addDocument('ro', 'Ajută-mă să găsesc o universitate.', 'university.recommend');

manager.addAnswer('ro', 'university.recommend', 'Te pot ajuta cu siguranță! Îmi poți spune puțin despre interesele tale sau despre tipul de program care te interesează?');
manager.addAnswer('ro', 'university.recommend', 'Sigur! Ce domeniu te interesează să studiezi? Îți pot oferi câteva sugestii.');
manager.addAnswer('ro', 'university.recommend', 'Să începem! Ce tip de universitate cauți—publică, privată sau specializată?');

// Quiz Assistance Intent (Romanian)
manager.addDocument('ro', 'Vreau să fac quiz-ul pentru universitate', 'quiz.assistance');
manager.addDocument('ro', 'Mă poți ajuta cu quiz-ul?', 'quiz.assistance');
manager.addDocument('ro', 'Cum pot face quiz-ul pentru a găsi universitatea potrivită?', 'quiz.assistance');
manager.addDocument('ro', 'Unde este quiz-ul pentru alegerea universității?', 'quiz.assistance');
manager.addDocument('ro', 'Ajută-mă să încep quiz-ul pentru universitate.', 'quiz.assistance');

manager.addAnswer('ro', 'quiz.assistance', 'Pentru a te ajuta să găsești cea mai bună universitate pentru tine, îți recomand să faci quiz-ul nostru. Poți accesa quiz-ul aici: [Link către quiz].');
manager.addAnswer('ro', 'quiz.assistance', 'Quiz-ul este o modalitate excelentă de a-ți restrânge opțiunile! Spune-mi dacă vrei să te ghidez.');
manager.addAnswer('ro', 'quiz.assistance', 'Desigur! Poți face quiz-ul vizitând secțiunea de quiz sau dând click aici: www.choose-uni.com/quiz.');


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

// Process User Input
async function getBotResponse(userInput) {
    try {
        const response = await manager.process('ro', userInput);
        return response.answer || "Îmi pare rău, nu înțeleg.";
    } catch (error) {
        console.error('Error processing user input:', error);
        return "A apărut o eroare. Te rog încearcă din nou.";
    }
}

module.exports = { getBotResponse };
