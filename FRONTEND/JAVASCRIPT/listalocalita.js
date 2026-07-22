// file: JAVASCRIPT/listalocalita.js

document.addEventListener("DOMContentLoaded", function() {
    // Seleziona il contenitore della lista nell'HTML
    const listaContainer = document.getElementById("lista-localita");

    // Svuota il contenitore rimuovendo i placeholder inseriti staticamente
    listaContainer.innerHTML = "";

    // Cicla attraverso tutte le chiavi (id) del finto database
    for (const [id, dati] of Object.entries(databaseLocalita)) {

        // 1. Crea il tag <a> che funge da contenitore/card
        const cardLink = document.createElement("a");

        // 2. Crea l'URL dinamico iniettando l'id della località
        cardLink.href = `localita.html?id=${id}`;
        cardLink.className = "localita-card";

        // 3. Costruisce la struttura HTML interna sostituendo i dati reali
        // Nota: Il campo "Eventi" è stato sostituito con "Provincia" poiché è il dato disponibile in dati_localita.js
        cardLink.innerHTML = `
            <div class="card-image-wrapper">
                <img src="${dati.immaginePrincipale}" alt="Foto di ${dati.titolo}">
            </div>
            
            <div class="card-info-wrapper">
                <div class="info-group">
                    <span class="info-label">Nome:</span>
                    <p class="info-value">${dati.titolo}</p>
                </div>
                
                <div class="info-group">
                    <span class="info-label">Descrizione:</span>
                    <p class="info-value">${dati.descrizione}</p>
                </div>
                
                <div class="info-group">
                    <span class="info-label">Provincia:</span>
                    <p class="info-value">${dati.provincia}</p>
                </div>
            </div>
        `;

        // 4. Inserisce la card completa nella pagina
        listaContainer.appendChild(cardLink);
    }
});