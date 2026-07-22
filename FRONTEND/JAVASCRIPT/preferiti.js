document.addEventListener("DOMContentLoaded", function() {
    const favoriteBtn = document.querySelector(".favorite-btn");
    if (!favoriteBtn) return;

    const cuoreImg = favoriteBtn.querySelector("img");
    const urlParams = new URLSearchParams(window.location.search);
    const idLocalita = urlParams.get("id");

    if (!idLocalita) return;

    let nomeLocalita = "";

    // 1. Identifica il nome dal database statico
    if (typeof databaseLocalita !== 'undefined' && databaseLocalita[idLocalita]) {
        nomeLocalita = databaseLocalita[idLocalita].titolo || databaseLocalita[idLocalita].nome;
    }

    // 2. Se non presente, cerca nei dati aggiunti in sessione
    if (!nomeLocalita) {
        const localitaSessione = JSON.parse(sessionStorage.getItem('localitaUtente')) || [];
        const datiSessione = localitaSessione.find(l => l.id === idLocalita);
        if (datiSessione) {
            nomeLocalita = datiSessione.nome || datiSessione.titolo;
        }
    }

    // 3. Fallback sull'HTML nel caso manchino i dati
    if (!nomeLocalita) {
        const titoloElement = document.getElementById("localita-titolo");
        if (titoloElement) {
            nomeLocalita = titoloElement.innerText.trim();
        }
    }

    if (!nomeLocalita) return;

    let preferiti = JSON.parse(sessionStorage.getItem("localitaPreferite")) || [];

    if (preferiti.includes(nomeLocalita)) {
        cuoreImg.setAttribute("src", "IMAGES/cuore_pieno.svg");
    }

    favoriteBtn.addEventListener("click", function() {
        const currentSrc = cuoreImg.getAttribute("src");

        if (currentSrc.includes("cuore_vuoto.svg")) {
            cuoreImg.setAttribute("src", "IMAGES/cuore_pieno.svg");
            if (!preferiti.includes(nomeLocalita)) {
                preferiti.push(nomeLocalita);
            }
        } else {
            cuoreImg.setAttribute("src", "IMAGES/cuore_vuoto.svg");
            preferiti = preferiti.filter(nome => nome !== nomeLocalita);
        }

        sessionStorage.setItem("localitaPreferite", JSON.stringify(preferiti));
        console.log("Preferiti salvati in sessione:", preferiti);
    });
});