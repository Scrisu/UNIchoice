 // JavaScript pentru schimbarea orașului
 document.getElementById("city-select").addEventListener("change", function () {
    const selectedCity = this.value;
    document.querySelectorAll(".section").forEach(section => {
        section.classList.remove("active");
    });
    if (selectedCity) {
        document.getElementById(selectedCity).classList.add("active");
    }
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