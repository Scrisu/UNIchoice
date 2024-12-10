document.addEventListener("DOMContentLoaded", () => {
  // Referințe la elementele HTML
  const priceInput = document.getElementById("price");
  const priceValue = document.getElementById("price-value");
  const accommodationList = document.getElementById("accommodation-list");
  const noResultsMessage = document.getElementById("no-results-message");
  const alternativesSection = document.getElementById("alternatives");

  // Actualizarea prețului când se modifică slider-ul
  priceInput.addEventListener("input", () => {
   priceValue.textContent = `${priceInput.value} RON`;

  });

  // Inițializare hartă
  const map = L.map('map').setView([45.9432, 24.9668], 6); // Centru România
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

 // Datele căminelor (exemplu de obiecte)
const accommodations = [
  { id: 1, name: "Cămin Universitatea Ovidius Constanța", city: "Constanța", price: 220, roomType: "single", lat: 45.5, lng: 28.5, rating: 4, facilities: ["wifi", "parking"], description: "Cămin bine situat." },
  { id: 2, name: "Cămin Particular Constanța City Lodge", city: "Constanța", price: 300, roomType: "double", lat: 45.6, lng: 28.6, rating: 5, facilities: ["wifi"], description: "Cămin modern și confortabil." },
  { id: 3, name: "Cămin Universitatea din Craiova (UCV) – Campus Nicolae Titulescu", city: "Craiova", price: 180, roomType: "single", lat: 44.3, lng: 23.8, rating: 3, facilities: ["wifi", "parking"], description: "Cămin confortabil cu facilități de bază." },
  { id: 4, name: "Cămin UMF Craiova", city: "Craiova", price: 250, roomType: "single", lat: 44.3, lng: 23.9, rating: 4, facilities: ["wifi", "kitchen"], description: "Cămin modern, aproape de campus." },
  { id: 5, name: "Cămin Universitatea din Oradea – Campus Central", city: "Oradea", price: 220, roomType: "double", lat: 47.0, lng: 21.9, rating: 4, facilities: ["wifi", "parking"], description: "Cămin situat central, ideal pentru studenți." },
  { id: 6, name: "Cămin Particular Elite Residence Oradea", city: "Oradea", price: 350, roomType: "studio", lat: 47.1, lng: 21.9, rating: 5, facilities: ["wifi", "laundry"], description: "Cămin de lux cu facilități excelente." },
  { id: 7, name: "Cămin Universitatea „Lucian Blaga” Sibiu (ULBS) – Cămin 1", city: "Sibiu", price: 200, roomType: "single", lat: 45.8, lng: 24.1, rating: 4, facilities: ["wifi", "gym"], description: "Cămin modern cu multe facilități." },
  { id: 8, name: "Cămin Particular Sibiu Student Hostel", city: "Sibiu", price: 280, roomType: "double", lat: 45.8, lng: 24.2, rating: 4, facilities: ["wifi", "parking"], description: "Cămin confortabil cu facilități de top." },
  { id: 9, name: "Cămin Universitatea „Ștefan cel Mare” Suceava (USV) – Căminul 2", city: "Suceava", price: 230, roomType: "single", lat: 47.7, lng: 26.3, rating: 3, facilities: ["wifi", "parking"], description: "Cămin situat în apropiere de campus." },
  { id: 10, name: "Cămin Particular Casa Studenților Suceava", city: "Suceava", price: 300, roomType: "double", lat: 47.7, lng: 26.2, rating: 5, facilities: ["wifi", "kitchen"], description: "Cămin modern și confortabil." },
  { id: 11, name: "Cămin Universitatea de Medicină, Farmacie, Științe și Tehnologie (UMFST) – Căminul 1", city: "Târgu Mureș", price: 240, roomType: "single", lat: 46.5, lng: 24.6, rating: 4, facilities: ["wifi", "gym"], description: "Cămin pentru studenți la medicină." },
  { id: 12, name: "Cămin Particular Mureș Student Residence", city: "Târgu Mureș", price: 350, roomType: "studio", lat: 46.6, lng: 24.6, rating: 5, facilities: ["wifi", "laundry", "kitchen"], description: "Cămin de lux cu facilități excelente." },
  { id: 13, name: "Cămin Universitatea de Vest Timișoara (UVT) – Căminul 4", city: "Timișoara", price: 210, roomType: "single", lat: 45.7, lng: 21.2, rating: 4, facilities: ["wifi", "gym"], description: "Cămin situat aproape de campus." },
  { id: 14, name: "Cămin Particular Timișoara Student Living", city: "Timișoara", price: 320, roomType: "double", lat: 45.7, lng: 21.3, rating: 5, facilities: ["wifi", "laundry", "kitchen"], description: "Cămin modern, ideal pentru studenți." },
  { id: 15, name: "Cămin Titu Maiorescu Iași", city: "Iași", price: 210, roomType: "single", lat: 47.2, lng: 27.6, rating: 3, facilities: ["wifi", "parking"], description: "Cămin vechi, dar confortabil." },
  { id: 16, name: "Cămin Gaudeamus Iași", city: "Iași", price: 280, roomType: "double", lat: 47.2, lng: 27.6, rating: 4, facilities: ["wifi", "gym"], description: "Cămin bine echipat și accesibil." },
  { id: 17, name: "Cămin Universitatea Ovidius Constanța – Cămin 2", city: "Constanța", price: 210, roomType: "single", lat: 45.6, lng: 28.5, rating: 4, facilities: ["wifi", "kitchen"], description: "Cămin pentru studenți, situat aproape de campus." },
  { id: 18, name: "Cămin Particular Constanța Student Residence", city: "Constanța", price: 350, roomType: "studio", lat: 45.7, lng: 28.6, rating: 5, facilities: ["wifi", "laundry", "parking"], description: "Cămin de lux, cu facilități moderne." },
  { id: 19, name: "Cămin Universitatea din Craiova – Campus Nicolae Titulescu", city: "Craiova", price: 190, roomType: "single", lat: 44.3, lng: 23.7, rating: 3, facilities: ["wifi", "gym"], description: "Cămin cu facilități de bază, situat în apropiere de universitate." },
  { id: 20, name: "Cămin Particular Craiova Student Residence", city: "Craiova", price: 300, roomType: "double", lat: 44.4, lng: 23.8, rating: 4, facilities: ["wifi", "laundry"], description: "Cămin modern, aproape de campus." },
  { id: 21, name: "Cămin Universitatea „Lucian Blaga” Sibiu (ULBS) – Cămin 2", city: "Sibiu", price: 220, roomType: "single", lat: 45.8, lng: 24.2, rating: 4, facilities: ["wifi", "parking"], description: "Cămin central, aproape de majoritatea obiectivelor." },
  { id: 22, name: "Cămin Particular Sibiu Living", city: "Sibiu", price: 330, roomType: "studio", lat: 45.8, lng: 24.1, rating: 5, facilities: ["wifi", "kitchen"], description: "Cămin modern, cu facilități deosebite." },
  { id: 23, name: "Cămin Universitatea de Medicină și Farmacie Iași", city: "Iași", price: 240, roomType: "single", lat: 47.2, lng: 27.5, rating: 4, facilities: ["wifi", "gym"], description: "Cămin pentru studenții la medicină." },
  { id: 24, name: "Cămin Particular Iași Student Residence", city: "Iași", price: 320, roomType: "double", lat: 47.3, lng: 27.6, rating: 5, facilities: ["wifi", "laundry", "kitchen"], description: "Cămin de lux, foarte aproape de campus." },
  { id: 25, name: "Cămin Universitatea „Ștefan cel Mare” Suceava – Căminul 1", city: "Suceava", price: 200, roomType: "single", lat: 47.6, lng: 26.3, rating: 3, facilities: ["wifi", "gym"], description: "Cămin confortabil, situat aproape de facultate." },
  { id: 26, name: "Cămin Particular Suceava Student Residence", city: "Suceava", price: 280, roomType: "double", lat: 47.7, lng: 26.4, rating: 4, facilities: ["wifi", "laundry"], description: "Cămin modern și accesibil." },
  { id: 27, name: "Cămin Universitatea din Oradea – Campus Universitar", city: "Oradea", price: 230, roomType: "single", lat: 47.0, lng: 21.8, rating: 4, facilities: ["wifi", "parking"], description: "Cămin central, aproape de campus." },
  { id: 28, name: "Cămin Particular Oradea Residence", city: "Oradea", price: 310, roomType: "studio", lat: 47.1, lng: 21.9, rating: 5, facilities: ["wifi", "laundry"], description: "Cămin modern și deosebit." }
];


  // Afișarea căminelor pe hartă
const renderMap = (data) => {
  data.forEach(item => {
    L.marker([item.lat, item.lng])
      .addTo(map)
      .bindPopup(`${item.name} - ${item.city}`);
  });
};


  // Funcție de filtrare
  const filterAccommodations = () => {
    const cityFilter = document.getElementById("city").value;
    const roomTypeFilter = document.getElementById("room-type").value;
    const priceFilter = Number(priceInput.value);
    const ratingFilter = Number(document.getElementById("rating").value);
    const facilitiesFilter = Array.from(document.querySelectorAll('.filter-group input[type="checkbox"]:checked'))
                                  .map(checkbox => checkbox.value);

    const filteredData = accommodations.filter(item => {
      const matchesCity = !cityFilter || item.city === cityFilter;
      const matchesRoomType = !roomTypeFilter || item.roomType === roomTypeFilter;
      const matchesPrice = item.price <= priceFilter;
      const matchesRating = !ratingFilter || item.rating >= ratingFilter;
      const matchesFacilities = facilitiesFilter.every(facility => item.facilities.includes(facility));

      return matchesCity && matchesRoomType && matchesPrice && matchesRating && matchesFacilities;
    });

    // Verifică dacă s-au găsit rezultate
    if (filteredData.length === 0) {
      accommodationList.innerHTML = "";  // Curăță lista
      noResultsMessage.textContent = "Nu s-au găsit cămine care să corespundă filtrului selectat.";
      alternativesSection.style.display = "block";
    } else {
      accommodationList.innerHTML = "";  // Curăță lista
      noResultsMessage.textContent = "";
      alternativesSection.style.display = "none";
      renderAccommodations(filteredData);
      renderMap(filteredData);
    }
  };

  // Afișare rezultate cămine
  const renderAccommodations = (data) => {
    data.forEach(item => {
      const div = document.createElement("div");
      div.className = "accommodation-item";
      div.innerHTML = `
        <h3>${item.name}</h3>
        <p>Oraș: ${item.city}</p>
        <p>Preț: ${item.price} RON</p>
        <p>Tip cameră: ${item.roomType}</p>
        <p>${item.description}</p>
        <p><strong>Rating:</strong> ${'★'.repeat(item.rating)}</p>
        <p><strong>Facilități:</strong> ${item.facilities.join(", ")}</p>
        <button class="details-button" onclick="openPopup('popup-${item.id}')">Vezi Detalii</button>
      `;
      accommodationList.appendChild(div);

      // Creare pop-up dinamic pentru fiecare cămin
      const popup = document.createElement("div");
      popup.id = `popup-${item.id}`;
      popup.classList.add('popup');
      popup.innerHTML = `
        <div class="popup-content">
          <span class="close" onclick="closePopup('popup-${item.id}')">&times;</span>
          <h3>${item.name}</h3>
          <p><strong>Oraș:</strong> ${item.city}</p>
          <p><strong>Preț:</strong> ${item.price} RON</p>
          <p><strong>Tip Cameră:</strong> ${item.roomType}</p>
          <p><strong>Descriere:</strong> ${item.description}</p>
          <p><strong>Rating:</strong> ${'★'.repeat(item.rating)}</p>
          <p><strong>Facilități:</strong> ${item.facilities.join(", ")}</p>
        </div>
      `;
      document.body.appendChild(popup);
    });
  };

  // Aplica filtrele la apăsarea butonului
  document.getElementById("apply-filters").addEventListener("click", (e) => {
    e.preventDefault();
    filterAccommodations();
  });

  // Funcție pentru deschiderea pop-up-ului
  window.openPopup = function(popupId) {
    document.getElementById(popupId).style.display = 'flex';
  };

  // Funcție pentru închiderea pop-up-ului
  window.closePopup = function(popupId) {
    document.getElementById(popupId).style.display = 'none';
  };

  // Inițializare hartă și afișare căminele fără filtre aplicate
  renderMap(accommodations);
  renderAccommodations(accommodations);

  // Adăugare header și footer din fișiere externe
  fetch('activity_bar.html')
    .then(response => response.text())
    .then(data => document.getElementById('header-placeholder').innerHTML = data)
    .catch(error => console.error('Error loading header/footer:', error));

  fetch('footer.html')
    .then(response => response.text())
    .then(data => document.getElementById('footer-placeholder').innerHTML = data)
    .catch(error => console.error('Error loading header/footer:', error));
});
