document.addEventListener("DOMContentLoaded", function() {
    // Specifica il percorso del file contenente l'HTML della navbar
    fetch('../HTML/navbar.html')
        .then(response => {
            if (!response.ok) {
                throw new Error("Errore nel caricamento della navbar");
            }
            return response.text();
        })
        .then(data => {
            document.getElementById("navbar-container").innerHTML = data;
        })
        .catch(error => {
            console.error("Errore:", error);
        });
});