    // Filtrare Evenimente pe tip și oraș
    const filterType = document.getElementById('event-type');
    const filterCity = document.getElementById('city');
    const resetButton = document.getElementById('reset-filters');
    const eventItems = document.querySelectorAll('.swiper-slide');  // Menținem selecția pentru swiper-slide
    
    // Filtrare evenimente
    function filterEvents() {
        const selectedType = filterType.value;
        const selectedCity = filterCity.value;
    
        eventItems.forEach(item => {
            const itemType = item.getAttribute('data-type');
            const itemCity = item.getAttribute('data-city');
    
            if ((selectedType === '' || itemType === selectedType) && 
                (selectedCity === '' || itemCity === selectedCity)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    // Resetare filtre
    function resetFilters() {
        // Resetare filtre selectate
        filterType.value = '';
        filterCity.value = '';
    
        // Afișează toate evenimentele
        eventItems.forEach(item => {
            item.style.display = 'block';
        });
    }
    
    // Adaugă event listeners pentru filtre și butonul de resetare
    filterType.addEventListener('change', filterEvents);
    filterCity.addEventListener('change', filterEvents);
    resetButton.addEventListener('click', resetFilters);
    
    
    
            // Fetch pentru header și footer
            fetch('activity_bar.html')
                .then(response => response.text())
                .then(data => document.getElementById('header-placeholder').innerHTML = data)
                .catch(error => console.error('Error loading header:', error));
    
            fetch('footer.html')
                .then(response => response.text())
                .then(data => document.getElementById('footer-placeholder').innerHTML = data)
                .catch(error => console.error('Error loading footer:', error));
    
    
               
    
                document.addEventListener('DOMContentLoaded', function () {
        const calendarEl = document.getElementById('custom-calendar');
    
        const calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth', // Vizualizare implicită
            locale: 'ro',
            headerToolbar: {
                left: 'prev,next today',  // Navigare simplă
                center: 'title',
                right: '' // Nu afișăm butoanele pentru alte vizualizări
            },
            events: [
        {
            title: 'Leaders Experience Sesiune #1 Coaching Online',
            start: '2025-05-13',
            end: '2025-05-13',
            description: 'Sesiune dedicată dezvoltării abilităților de leadership și coaching pentru studenți.',
            link: 'https://www.leaders.ro'  // Exemplu link, poate fi schimbat în funcție de site-ul oficial
        },
        {
            title: 'Webinar „Antreprenoriatul Studențesc”',
            start: '2025-05-08',
            end: '2025-05-08',
            description: 'Curs online despre crearea de afaceri pentru studenți, oferind ghidaj pentru start-up-uri.',
            link: 'https://www.linkedin.com'  // Exemplu link, poate fi schimbat în funcție de detaliile evenimentului
        },
        {
            title: 'TEDx Timișoara Students',
            start: '2025-04-22',
            end: '2025-04-22',
            description: 'Discursuri inspiraționale susținute de studenți și antreprenori locali.',
            link: 'https://www.tedxtimisoara.com'  // Link real pentru TEDx Timișoara
        },
        {
            title: 'Festivalul Artelor Vizuale',
            start: '2025-06-15',
            end: '2025-06-15',
            description: 'Expoziții de artă și design realizate de studenți, promovând creativitatea tinerilor.',
            link: 'https://www.casa.studentilor.timisoara.ro'  // Exemplu link, poate fi schimbat în funcție de organizatori
        },
        {
            title: 'Crosul Studențesc pentru Mediu',
            start: '2025-05-12',
            end: '2025-05-12',
            description: 'Eveniment sportiv dedicat sensibilizării asupra problemelor de mediu.',
            link: 'https://www.unitbv.ro'  // Link oficial pentru Universitatea Transilvania Brașov
        },
        {
            title: 'Școala de Vară 2025',
            start: '2025-08-05',
            end: '2025-08-15',
            description: 'Workshopuri pe teme de dezvoltare personală și sustenabilitate.',
            link: 'https://www.unitbv.ro'  // Link oficial pentru Universitatea Transilvania Brașov
        },
        {
            title: 'Zilele Carierei 2025',
            start: '2025-03-20',
            end: '2025-03-20',
            description: 'Târg de locuri de muncă și orientare profesională pentru studenți.',
            link: 'https://www.sala-polivalenta.ro'  // Link pentru Sala Polivalentă din Cluj
        },
        {
            title: 'Festivalul Studențesc de Teatru',
            start: '2025-05-15',
            end: '2025-05-15',
            description: 'Eveniment cultural cu spectacole și workshopuri teatrale.',
            link: 'https://www.tncluj.ro'  // Link pentru Teatrul Național Cluj-Napoca
        },
        {
            title: 'Târgul de Cariere IT',
            start: '2025-05-05',
            end: '2025-05-05',
            description: 'Târg dedicat studenților pasionați de tehnologie, cu oportunități de joburi și internshipuri.',
            link: 'https://www.palas.ro'  // Link oficial pentru Palas Iași
        },
        {
            title: 'Noaptea Cercetătorilor 2025',
            start: '2025-09-25',
            end: '2025-09-25',
            description: 'Eveniment național care promovează știința prin experimente interactive și prezentări.',
            link: 'https://www.nopteacercetatorilor.ro'  // Link oficial pentru Noaptea Cercetătorilor
        }
    ],
    
            eventClick: function(info) {
                // Populează popup-ul cu datele evenimentului
                document.getElementById('modal-title').textContent = info.event.title;
                document.getElementById('modal-description').textContent = info.event.extendedProps.description;
    
                // Afișează popup-ul și overlay-ul
                document.getElementById('modal-overlay').style.display = 'block';
                document.getElementById('event-modal').style.display = 'block';
            }
        });
    
        calendar.render();
    
        // Închide popup-ul când utilizatorul apasă pe "Închide"
        document.getElementById('modal-close').addEventListener('click', function () {
            document.getElementById('modal-overlay').style.display = 'none';
            document.getElementById('event-modal').style.display = 'none';
        });
    
        // Închide popup-ul când utilizatorul apasă pe overlay
        document.getElementById('modal-overlay').addEventListener('click', function () {
            document.getElementById('modal-overlay').style.display = 'none';
            document.getElementById('event-modal').style.display = 'none';
        });
    });
    
    ///SWIPER
    const swiper = new Swiper('.swiper-container', {
            slidesPerView: 3, // numărul de carduri vizibile pe ecran
            spaceBetween: 20, // spațiu între carduri
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true, // Permite paginarea prin click
            },
            loop: true, // Permite derularea continuă a sliderului
            breakpoints: {
                1024: {
                    slidesPerView: 3, // La ecrane mari (desktop), se afișează 3 carduri
                },
                768: {
                    slidesPerView: 2, // La ecrane medii (tabletă), se afișează 2 carduri
                },
                480: {
                    slidesPerView: 1, // La ecrane mici (mobil), se afișează 1 card
                }
            }
        });