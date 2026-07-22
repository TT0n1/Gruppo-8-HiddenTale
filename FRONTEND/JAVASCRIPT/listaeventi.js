// file: JAVASCRIPT/listaeventi.js

document.addEventListener("DOMContentLoaded", function() {
    const listaContainer = document.getElementById("lista-eventi");

    // Svuota eventuali contenuti statici
    listaContainer.innerHTML = "";

    // Itera sul database eventi e crea le card
    for (const [id, dati] of Object.entries(databaseEventi)) {
        const cardLink = document.createElement("a");
        cardLink.href = `evento.html?id=${id}`;
        cardLink.className = "evento-card";

        cardLink.innerHTML = `
            <div class="card-image-wrapper">
                <img src="${dati.immagineLocandina}" alt="Locandina di ${dati.nome}">
            </div>
            <div class="card-info-wrapper">
                <div class="info-group">
                    <span class="info-label">Nome:</span>
                    <p class="info-value">${dati.nome}</p>
                </div>
                <div class="info-group">
                    <span class="info-label">Descrizione:</span>
                    <p class="info-value">${dati.descrizione}</p>
                </div>
                <div class="info-group">
                    <span class="info-label">Indirizzo:</span>
                    <p class="info-value">${dati.indirizzo}</p>
                </div>
            </div>
        `;

        listaContainer.appendChild(cardLink);
    }
});