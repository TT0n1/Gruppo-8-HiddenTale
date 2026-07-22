// Sostituisci l'intero contenuto di JAVASCRIPT/listalocalita.js con questo:

document.addEventListener('DOMContentLoaded', () => {
    const listaContainer = document.getElementById('lista-localita');
    const searchInput = document.getElementById('search-bar');
    const formFiltri = document.getElementById('form-filtri');

    if (typeof databaseLocalita === 'undefined') {
        console.error("Errore: databaseLocalita non trovato.");
        return;
    }

    // Rendiamo la funzione globale così lo script filtri.js può vederla e chiamarla
    window.aggiornaVista = function() {
        if (!listaContainer) return;

        const testoRicerca = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const opzioneFiltro = formFiltri ? formFiltri.querySelector('input[name="ordinamento"]:checked')?.value : 'tutti';

        let risultati = Object.entries(databaseLocalita);

        // 1. Filtro per testo (barra di ricerca)
        if (testoRicerca !== '') {
            risultati = risultati.filter(([id, dati]) => {
                const titolo = (dati.titolo || '').toLowerCase();
                const provincia = (dati.provincia || '').toLowerCase();
                return titolo.includes(testoRicerca) || provincia.includes(testoRicerca);
            });
        }

        // 2. Ordinamento (radio button)
        if (opzioneFiltro === 'az') {
            risultati.sort((a, b) => a[1].titolo.localeCompare(b[1].titolo));
        } else if (opzioneFiltro === 'za') {
            risultati.sort((a, b) => b[1].titolo.localeCompare(a[1].titolo));
        }

        // Svuota e riempie la lista
        listaContainer.innerHTML = '';

        if (risultati.length === 0) {
            listaContainer.innerHTML = '<p class="no-results" style="padding: 1rem; text-align: center; color: #4a3728;">Nessuna località trovata.</p>';
            return;
        }

        risultati.forEach(([id, dati]) => {
            const cardLink = document.createElement('a');
            cardLink.href = `localita.html?id=${id}`;
            cardLink.className = 'localita-card';

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
            listaContainer.appendChild(cardLink);
        });
    };

    if (searchInput) {
        searchInput.addEventListener('input', window.aggiornaVista);
    }

    window.aggiornaVista();
});