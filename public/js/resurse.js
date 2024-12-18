  // La începutul paginii, înainte de a renderiza subiectele, încarcă-le din localStorage
  document.addEventListener('DOMContentLoaded', function() {
    // Verifică dacă există subiecte salvate în localStorage
    const savedTopics = localStorage.getItem('topics');
    if (savedTopics) {
        // Dacă există, le convertește înapoi într-un array
        topics = JSON.parse(savedTopics);
    }

    // Renderizează subiectele
    renderTopics();
});

// Array pentru subiecte (acestea vor fi stocate într-o variabilă globală)
let topics = [
{ 
    username: 'Maria Popescu', 
    title: 'Ce facultăți sunt disponibile?', 
    content: 'Aș dori să știu care sunt facultățile oferite de universitate. Mă interesează mai multe detalii despre programele de studiu, ce specializări sunt disponibile și care sunt cerințele de admitere. De asemenea, aș vrea să aflu ce oportunități de carieră oferă fiecare facultate la finalizarea studiilor.', 
    category: 'facultati', 
    replies: [] 
},
{ 
    username: 'Ana', 
    title: 'Cum pot ajunge la campus?', 
    content: 'Vreau să știu cum pot ajunge la campus cu transportul public. Există linii de autobuz care merg direct spre campus sau este nevoie să fac o schimbare? Ce variante de transport sunt cele mai rapide și mai convenabile, mai ales în timpul orelor de vârf?', 
    category: 'transport', 
    replies: [] 
},
{ 
    username: 'Ruben', 
    title: 'Detalii despre căminele studențești', 
    content: 'Cine îmi poate oferi informații despre condițiile din cămine? Ce facilități sunt incluse în chirie? De asemenea, aș vrea să aflu dacă este posibil să aleg un anumit cămin sau dacă se fac alocări aleatorii. Care sunt costurile lunare și ce opțiuni de plată există?', 
    category: 'camine', 
    replies: [] 
},
{ 
    username: 'Naomi', 
    title: 'Care sunt opțiunile pentru cazare?', 
    content: 'Aș dori să aflu mai multe despre opțiunile de cazare disponibile. Pe lângă cămine, există și alte posibilități de cazare, cum ar fi apartamente sau camere de închiriat în apropierea campusului? Care sunt diferențele de preț și facilități între căminele universității și opțiunile private?', 
    category: 'camine', 
    replies: [] 
},
{ 
    username: 'Sebastian C.', 
    title: 'Transportul în oraș', 
    content: 'Cum pot ajunge din oraș în campus cu mijloacele de transport public? Există un sistem de transport specific pentru studenți? Cum pot obține un abonament sau un card de reducere pentru transportul public?', 
    category: 'transport', 
    replies: [] 
},
{ 
    username: 'Andreea L.', 
    title: 'Găsirea unui job part-time', 
    content: 'Există oportunități de muncă part-time pentru studenți? Care sunt domeniile în care pot lucra și ce tip de joburi sunt accesibile în timpul anului universitar? De asemenea, există posibilitatea de a lucra pe perioada vacanțelor, iar ce tipuri de joburi sunt cele mai populare printre studenți?', 
    category: 'facultati', 
    replies: [] 
}
];
// După ce adaugi sau modifici un subiect
localStorage.setItem('topics', JSON.stringify(topics));




// Variabile de control pentru paginare
let currentPage = 0;
const topicsPerPage = 3; // Numărul de subiecte pe pagină

// Funcție pentru a renderiza subiectele
function renderTopics() {
const topicsContainer = document.getElementById('topics');
topicsContainer.innerHTML = ''; // Golim containerul

// Calculăm subiectele care trebuie afișate în funcție de pagina curentă
const start = currentPage * topicsPerPage;
const end = start + topicsPerPage;
const topicsToDisplay = topics.slice(start, end);

// Adăugăm subiectele pe pagină
topicsToDisplay.forEach((topic, index) => {
    const topicElement = document.createElement('div');
    topicElement.className = 'forum-topic';
    topicElement.innerHTML = `
        <h3>${topic.title} <span>(${topic.category})</span></h3>
        <p>${topic.content}</p>
        <p><strong>Autor:</strong> ${topic.username}</p>
        <button onclick="showReplies(${start + index})"><i class="fas fa-arrow-down"></i></button>
        <div class="replies" id="replies-${start + index}" style="display: none;">
           <textarea placeholder="Scrie un răspuns..." id="reply-${start + index}" style="border: none; font-family: 'Source Sans Pro', sans-serif;"></textarea>
            <button onclick="addReply(${start + index})">Adaugă răspuns</button>
            <ul id="replyList-${start + index}">
                <!-- Răspunsurile vor fi afișate aici -->
            </ul>
        </div>
    `;
    topicsContainer.appendChild(topicElement);
});

// Actualizăm butoanele de navigare
updateNavigationButtons();
}

// Funcție pentru a actualiza butoanele de navigare
function updateNavigationButtons() {
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');

// Dacă suntem pe prima pagină, dezactivăm butonul „Înapoi”
prevButton.disabled = currentPage === 0;

// Dacă suntem pe ultima pagină, dezactivăm butonul „Înainte”
nextButton.disabled = (currentPage + 1) * topicsPerPage >= topics.length;
}

// Funcție pentru a merge la pagina anterioară
function goToPreviousPage() {
if (currentPage > 0) {
    currentPage--;
    renderTopics();
}
}

// Funcție pentru a merge la pagina următoare
function goToNextPage() {
if ((currentPage + 1) * topicsPerPage < topics.length) {
    currentPage++;
    renderTopics();
}
}

// Funcție pentru a adăuga un subiect nou
function addTopic() {
const username = document.getElementById('username').value;
const title = document.getElementById('topicTitle').value;
const content = document.getElementById('topicContent').value;
const category = document.getElementById('topicCategory').value;

if (username && title && content) {
    // Creăm un obiect pentru noul subiect
    const newTopic = { username, title, content, category, replies: [] };

    // Adăugăm subiectul în partea de sus a array-ului
    topics.unshift(newTopic);

    // Salvăm lista de subiecte în localStorage
    localStorage.setItem('topics', JSON.stringify(topics));

    // Re-renderizam subiectele pe pagină
    renderTopics();

    // Resetăm câmpurile de introducere
    document.getElementById('username').value = '';
    document.getElementById('topicTitle').value = '';
    document.getElementById('topicContent').value = '';
} else {
    showErrorMessage('Completează toate câmpurile!');
}
}

function showErrorMessage(message) {
// Crează un div pentru mesajul de eroare
const errorDiv = document.createElement('div');
errorDiv.textContent = message;
errorDiv.style.position = 'fixed';
errorDiv.style.top = '20px';
errorDiv.style.left = '50%';
errorDiv.style.transform = 'translateX(-50%)';
errorDiv.style.backgroundColor = '#f44336';
errorDiv.style.color = 'white';
errorDiv.style.padding = '15px 30px';
errorDiv.style.borderRadius = '5px';
errorDiv.style.fontSize = '16px';
errorDiv.style.fontWeight = 'bold';
errorDiv.style.textAlign = 'center';
errorDiv.style.zIndex = '1000';
errorDiv.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
document.body.appendChild(errorDiv);

// Îndepărtează mesajul după 3 secunde
setTimeout(() => {
    errorDiv.remove();
}, 3000);
}

// Afișare răspunsuri
function showReplies(index) {
const repliesContainer = document.getElementById(`replies-${index}`);
const isVisible = repliesContainer.style.display === 'block';
repliesContainer.style.display = isVisible ? 'none' : 'block';
}
// Funcție pentru a adăuga un răspuns
function addReply(topicIndex) {
const replyText = document.getElementById(`reply-${topicIndex}`).value;
if (replyText) {
    const topic = topics[topicIndex];
    topic.replies.push(replyText); // Add the reply to the topic

    // Save the updated topics list
    localStorage.setItem('topics', JSON.stringify(topics));

    // Update the reply list on the page
    const replyList = document.getElementById(`replyList-${topicIndex}`);
    const newReply = document.createElement('li');
    newReply.textContent = replyText; // Display the reply
    replyList.appendChild(newReply);

    // Reset the reply input field
    document.getElementById(`reply-${topicIndex}`).value = '';
}
}



// La începutul paginii, înainte de a renderiza subiectele, încarcă-le din localStorage
document.addEventListener('DOMContentLoaded', function() {
// Verifică dacă există subiecte salvate în localStorage
const savedTopics = localStorage.getItem('topics');
if (savedTopics) {
    // Dacă există, le parsim și le asignăm în array-ul 'topics'
    topics = JSON.parse(savedTopics);
}
renderTopics(); // Renderizează subiectele pe pagină
});

// Inițializare pagina
window.onload = function() {
renderTopics(); // Renderizează subiectele la încărcarea paginii
};
 
    
//TESTIMONIALE 
let currentIndex = 0;
const cardsVisible = 3; // Numărul de testimoniale vizibile simultan
const reviewCards = document.getElementById('reviewCards');
const reviewCardElements = document.querySelectorAll('.review-card');
const totalReviews = reviewCardElements.length;
const cardWidth = 320; // Lățimea unui card, inclusiv margini

let autoSlideInterval; // Variabila pentru intervalul de schimbare automată

// Clonează primul set de carduri la final și ultimul set la început
for (let i = 0; i < cardsVisible; i++) {
const firstClone = reviewCardElements[i].cloneNode(true);
const lastClone = reviewCardElements[totalReviews - i - 1].cloneNode(true);
reviewCards.appendChild(firstClone);
reviewCards.insertBefore(lastClone, reviewCards.firstChild);
}

// Setează poziția de start pentru a evita „săriturile”
reviewCards.style.transform = `translateX(-${cardsVisible * cardWidth}px)`;

// Actualizează transformările
function updateTransform() {
reviewCards.style.transition = 'transform 0.5s ease';
reviewCards.style.transform = `translateX(-${(currentIndex + cardsVisible) * cardWidth}px)`;
}

// Mergi la următorul review
function nextReview() {
currentIndex++;
updateTransform();

// Verificăm dacă am ajuns la finalul real și resetăm pentru ciclicitate
if (currentIndex >= totalReviews) {
    setTimeout(() => {
        reviewCards.style.transition = 'none'; // Elimină tranziția pentru resetare
        currentIndex = 0; // Revine la primul card real
        reviewCards.style.transform = `translateX(-${cardsVisible * cardWidth}px)`;
    }, 500); // Așteptăm ca tranziția să se termine
}
}

// Mergi la review-ul anterior
function prevReview() {
currentIndex--;
updateTransform();

// Verificăm dacă am ajuns la începutul real și resetăm pentru ciclicitate
if (currentIndex < 0) {
    setTimeout(() => {
        reviewCards.style.transition = 'none';
        currentIndex = totalReviews - 1;
        reviewCards.style.transform = `translateX(-${(currentIndex + cardsVisible) * cardWidth}px)`;
    }, 500);
}
}

// Navigare automată - schimbă testimonialele la fiecare 3 secunde
function startAutoSlide() {
autoSlideInterval = setInterval(nextReview, 3000);
}

// Oprește schimbarea automată
function stopAutoSlide() {
clearInterval(autoSlideInterval);
}

// Începe schimbarea automată atunci când pagina se încarcă
startAutoSlide();

// Reaplicăm tranziția după resetare pentru a asigura efectul ciclic
reviewCards.addEventListener('transitionend', () => {
reviewCards.style.transition = 'transform 0.5s ease';
});

// Evenimentul mouseover oprește schimbarea automată
reviewCards.addEventListener('mouseover', () => {
stopAutoSlide();
});

// Evenimentul mouseleave reluarea schimbării automate
reviewCards.addEventListener('mouseleave', () => {
startAutoSlide();
});



    fetch('activity_bar.html') // Fetch pentru header și footer
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
        })
        .catch(error => console.error('Error loading header:', error));

    // Încarcă footer-ul
    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        })
        .catch(error => console.error('Error loading footer:', error));
;



