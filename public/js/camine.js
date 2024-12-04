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

    // Datele despre cămine
    const accommodations = [
      {
        name: "Cămin Grozăvești",
        city: "bucuresti",
        price: 400,
        lat: 44.4285,
        lng: 26.1025,
        description: "Cămin modern, aproape de Universitatea din București.",
        roomType: "single",
        rating: 4,
        facilities: ["Wi-Fi", "Bucătărie comună", "Parcare"]
      },
      {
        name: "Cămin Observator",
        city: "cluj",
        price: 500,
        lat: 46.7707,
        lng: 23.5892,
        description: "Aproape de centrul orașului Cluj-Napoca.",
        roomType: "double",
        rating: 5,
        facilities: ["Wi-Fi", "Spălătorie"]
      },
      {
        name: "Cămin Titu Maiorescu",
        city: "iasi",
        price: 350,
        lat: 47.1585,
        lng: 27.6014,
        description: "Un cămin liniștit, ideal pentru studenți la UAIC.",
        roomType: "triple",
        rating: 3,
        facilities: ["Wi-Fi", "Săli de studiu"]
      },
      {
        name: "Cămin Complex Studențesc",
        city: "timisoara",
        price: 450,
        lat: 45.7489,
        lng: 21.2087,
        description: "Modern și accesibil, aproape de UPT.",
        roomType: "private-bathroom",
        rating: 4,
        facilities: ["Wi-Fi", "Bucătărie comună", "Spălătorie"]
      }
    ];

    // Inițializare hartă
    const map = L.map('map').setView([45.9432, 24.9668], 6); // Centru România
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

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
        `;
        accommodationList.appendChild(div);
      });
    };

    // Aplica filtrele la apăsarea butonului
    document.getElementById("apply-filters").addEventListener("click", filterAccommodations);

    // Inițializare hartă și afișare căminele fără filtre aplicate
    renderMap(accommodations);
    renderAccommodations(accommodations);
  });



  fetch('activity_bar.html') // Fetch pentru header și footer
          .then(response => response.text())
          .then(data => {
              document.getElementById('header-placeholder').innerHTML = data;
              
          })
          .catch(error => console.error('Error loading header/footer:', error));

          fetch('footer.html') // Fetch pentru header și footer
          .then(response => response.text())
          .then(data => {
             
              document.getElementById('footer-placeholder').innerHTML = data;
          })
          .catch(error => console.error('Error loading header/footer:', error));
