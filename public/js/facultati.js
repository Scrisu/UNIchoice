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



document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.faculty-card'); // Select all cards
    const overlay = document.getElementById('popup-overlay'); // Shared overlay
  
    cards.forEach(card => {
      const cardId = card.getAttribute('data-id'); // Get card's unique ID
      const popup = document.getElementById(`popup-${cardId}`); // Match with corresponding pop-up
  
      if (popup) {
        const closeButton = popup.querySelector('.close-popup'); // Close button inside the pop-up
  
        // Show pop-up when card is clicked
        card.addEventListener('click', () => {
          popup.classList.add('show');
          overlay.classList.add('show');
        });
  
        // Close pop-up when close button is clicked
        closeButton.addEventListener('click', () => {
          popup.classList.remove('show');
          overlay.classList.remove('show');
        });
      }
    });
  
    // Close pop-ups when overlay is clicked
    overlay.addEventListener('click', () => {
      document.querySelectorAll('.popup.show').forEach(popup => {
        popup.classList.remove('show');
      });
      overlay.classList.remove('show');
    });
  });
  
