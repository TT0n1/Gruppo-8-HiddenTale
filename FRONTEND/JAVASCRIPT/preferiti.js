document.addEventListener("DOMContentLoaded", function() {
    const favoriteBtn = document.querySelector(".favorite-btn");
    const cuoreImg = favoriteBtn.querySelector("img");

    // Prende il nome della località dal titolo della pagina (es. "Roma", "Milano")
    const titoloLocalita = document.getElementById("localita-titolo").innerText.trim();

    // Recupera l'array dei preferiti salvati in sessione, o crea un array vuoto se non esiste
    let preferiti = JSON.parse(sessionStorage.getItem("localitaPreferite")) || [];

    // 1. Al caricamento della pagina: se la località è già nei preferiti, mostra il cuore pieno
    if (preferiti.includes(titoloLocalita)) {
        cuoreImg.setAttribute("src", "IMAGES/cuore_pieno.svg");
    }

    // 2. Al click sul bottone: cambia immagine e aggiorna i preferiti in sessione
    favoriteBtn.addEventListener("click", function() {
        const currentSrc = cuoreImg.getAttribute("src");

        if (currentSrc.includes("cuore_vuoto.svg")) {
            // Selezionato: metti cuore pieno e aggiungi alla lista
            cuoreImg.setAttribute("src", "IMAGES/cuore_pieno.svg");

            if (!preferiti.includes(titoloLocalita)) {
                preferiti.push(titoloLocalita);
            }
        } else {
            // Deselezionato: metti cuore vuoto e rimuovi dalla lista
            cuoreImg.setAttribute("src", "IMAGES/cuore_vuoto.svg");

            // Filtra l'array mantenendo solo le località diverse da quella attuale
            preferiti = preferiti.filter(nome => nome !== titoloLocalita);
        }

        // Salva la lista aggiornata nel sessionStorage
        sessionStorage.setItem("localitaPreferite", JSON.stringify(preferiti));

        // Stampa in console (F12) per verificare che la lista si aggiorni correttamente
        console.log("Preferiti salvati in sessione:", preferiti);
    });
});