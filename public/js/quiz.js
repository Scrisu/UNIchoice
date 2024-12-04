const showQuizBtn = document.getElementById('showQuizBtn');
const quizModal = document.getElementById('quizModal');
const closeQuizBtn = document.getElementById('closeQuizBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
let currentPage = 1;



function showPage(page) {
  const pages = document.querySelectorAll('.question-page');
  pages.forEach((pageElem, index) => {
    pageElem.style.display = index + 1 === page ? 'block' : 'none'; // Afișăm doar pagina curentă
  });

  prevBtn.style.display = page > 1 ? 'inline-block' : 'none'; // Arătăm butonul "Înapoi" doar pentru paginile ulterioare primei
  nextBtn.textContent = page === pages.length ? 'Terminat' : 'Înainte'; // Schimbăm textul butonului "Înainte" pe ultima pagină
}

function validatePage(page) {
  const questions = document.querySelectorAll(`#page${page} input[type="radio"]:checked`);
  const totalQuestions = document.querySelectorAll(`#page${page} input[type="radio"]`).length / 5; // Presupunem că fiecare întrebare are 5 opțiuni

  if (questions.length === totalQuestions) {
    return true; // Dacă toate întrebările au fost răspuns
  }
  return false; // Dacă nu toate întrebările sunt bifate
}

// Funcție pentru calcularea și afișarea rezultatelor
function calculateResults() {
  const answers = Array.from(document.querySelectorAll('input[type="radio"]:checked')).map(input => input.value);
  if (answers.length < 1) {
    alert("Te rugăm să răspunzi la toate întrebările.");
    return;
  }

  const counts = { A: 0, B: 0, C: 0, D: 0, E: 0 }; // Include D și E
  answers.forEach(answer => counts[answer]++);  // Crește contorul corespunzător
  const maxCategory = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);  // Găsește categoria cu cel mai mare scor

  const results = {
    A: {
     
      image: "images/stiinteExacte.jpg",  // Înlocuiește cu link-ul către imaginea ta
      description: "<strong> Descriere: </strong> Ești pasionat de tehnologie și științe exacte, cu abilități excelente de rezolvare a problemelor și dorința de a dezvolta soluții inovatoare.",
      text: "<strong>Domeniu recomandat:</strong> Tehnologie, Inginerie sau Științe exacte.",
      faculties: "<strong>Sugestii de facultăți:</strong> Facultatea de Automatică și Calculatoare, Facultatea de Inginerie, Facultatea de Matematică și Informatică."
    },
    B: {
      
      image: "images/education.jpg",  // Înlocuiește cu link-ul către imaginea ta
      description: "<strong> Descriere: </strong>Ești creativ și empatic, cu dorința de a înțelege oamenii și cultura. Domeniile umaniste și educaționale îți permit să inspiri și să contribui la dezvoltarea societății.",
      text: "<strong>Domeniu recomandat:</strong> Științe umaniste sau Educație.",
      faculties: "<strong>Sugestii de facultăți:</strong> Facultatea de Litere, Facultatea de Istorie, Facultatea de Filosofie."
    },
    C: {
      
      image: "images/medicina.jpg",  // Înlocuiește cu link-ul către imaginea ta
      description: "<strong>Descriere:</strong> Ești empatic și dornic să ajuți, având abilități de a înțelege nevoile celor din jur, ceea ce te face potrivit pentru o carieră în sănătate, psihologie sau asistență socială."    ,
        text: "<strong>Domeniu recomandat: </strong> Medicină, Psihologie sau Asistență socială.",
      faculties: "<strong>Sugestii de facultăți: </strong>Facultatea de Medicină, Facultatea de Psihologie, Facultatea de Asistență Socială."
    },
    D: {
      
      image: "images/pictura.jpg",  // Înlocuiește cu link-ul către imaginea ta
      description: "<strong>Descriere:</strong> Ești creativ, cu o viziune originală și dorința de a exprima idei prin artă, design sau muzică, contribuind la îmbogățirea culturală a societății." ,
           text: "<strong>Domeniu recomandat:</strong> Arte vizuale, Design sau Muzică.",
      faculties: "<strong>Sugestii de facultăți:</strong> Facultatea de Arte, Facultatea de Design, Conservatorul de Muzică."
    },
    E: {
     
      image: "images/bussines.jpg",  // Înlocuiește cu link-ul către imaginea ta
      description: "<strong>Descriere:</strong> Ești creativ și ai o viziune originală, dorindu-ți să exprimi idei prin artă, design sau muzică, contribuind astfel la îmbogățirea culturală a societății.",
            text: "<strong>Domeniu recomandat:</strong> Management, Afaceri sau Analiză financiară.",
      faculties: "<strong>Sugestii de facultăți:</strong> Facultatea de Administrarea Afacerilor, Facultatea de Economie, Facultatea de Finanțe."
    }
  };

  // Afișăm rezultatul corect
   // Afișează facultățile recomandate
  document.getElementById('resultImage').src = results[maxCategory].image;
  document.getElementById('resultDescription').innerHTML = results[maxCategory].description;
  document.getElementById('resultText').innerHTML = results[maxCategory].text;
  document.getElementById('resulFaculties').innerHTML = results[maxCategory].faculties; 

  // Afișează modalul cu rezultatele
  document.getElementById('resultModal').style.display = 'block';
  quizModal.style.display = 'none';
}

// Eveniment pentru butonul „Înainte”
nextBtn.addEventListener('click', () => {
  if (validatePage(currentPage)) {
    currentPage++;  // Mărește numărul paginii
    if (currentPage <= 5) {
      showPage(currentPage);  // Afișează pagina următoare
    } else {
      calculateResults();  // Dacă este ultima pagină, calculăm rezultatele
    }
  } else {
    showErrorMessage('Te rugăm să răspunzi la măcar o întrebare de pe această pagină.');
  }
});

// Eveniment pentru butonul „Înapoi”
prevBtn.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    showPage(currentPage);
  }
});

// Eveniment de închidere pentru popup-ul de rezultat
document.getElementById('closeResultBtn').addEventListener('click', () => {
  document.getElementById('resultModal').style.display = 'none';  // Ascunde popup-ul de rezultat
});

// Inițializare: Afișăm prima pagină la încărcare
showPage(currentPage);

function showErrorMessage() {
    const message = "Toate întrebările sunt obligatorii"; // Mesajul fix

    // Crează un div pentru mesajul de eroare
    const errorDiv = document.createElement('div');
    errorDiv.textContent = message;

    // Stilizarea mesajului de eroare
    errorDiv.style.position = 'fixed';
    errorDiv.style.top = '20px';
    errorDiv.style.left = '50%';
    errorDiv.style.transform = 'translateX(-50%)';
    errorDiv.style.backgroundColor = '#f44336';
    errorDiv.style.color = 'white';
    errorDiv.style.padding = '10px 20px';  // Dimensiune mai mică a padding-ului
    errorDiv.style.borderRadius = '5px';
    errorDiv.style.fontSize = '14px';  // Font mai mic
    errorDiv.style.fontWeight = 'bold';
    errorDiv.style.textAlign = 'center';
    errorDiv.style.zIndex = '1000';
    errorDiv.style.boxShadow = '0 3px 6px rgba(0, 0, 0, 0.2)'; // Umbra mai mică

    // Adaugă mesajul de eroare în body-ul paginii
    document.body.appendChild(errorDiv);

    // Îndepărtează mesajul după câteva secunde
    setTimeout(() => {
        errorDiv.remove();
    }, 3000); // Mesajul va dispărea după 3 secunde
}

// Eveniment pentru butonul de închidere al quiz-ului
closeQuizBtn.addEventListener('click', () => {
  quizModal.style.display = 'none'; // Ascunde popup-ul de quiz
});
// Eveniment pentru butonul de închidere al quiz-ului
closeQuizBtn.addEventListener('click', () => {
  quizModal.style.display = 'none'; // Ascunde popup-ul de quiz
  
  // Redirecționează utilizatorul înapoi la pagina anterioară
  window.history.back(); // Aceasta îl va duce înapoi la pagina anterioară în browser
});

// Eveniment pentru butonul de închidere al rezultatului
closeResultBtn.addEventListener('click', () => {
  resultModal.style.display = 'none'; // Ascunde popup-ul de rezultat
  
  // Redirecționează utilizatorul înapoi la pagina anterioară
  window.history.back(); // Aceasta îl va duce înapoi la pagina anterioară în browser
});
