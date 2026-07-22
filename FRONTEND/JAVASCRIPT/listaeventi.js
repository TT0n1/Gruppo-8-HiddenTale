document.addEventListener('DOMContentLoaded', () => {
    const listaContainer = document.getElementById('lista-eventi');
    const searchInput = document.getElementById('search-bar');
    const formFiltri = document.getElementById('form-filtri');

    if (typeof databaseEventi === 'undefined') {
        console.error("Errore: databaseEventi non trovato.");
        return;
    }

    window.aggiornaVista = function() {
        if (!listaContainer) return;

        const testoRicerca = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const opzioneFiltro = formFiltri ? formFiltri.querySelector('input[name="evento-filtro"]:checked')?.value : 'tutti';

        // Supporta sia se databaseEventi è un Array, sia se è un Oggetto
        let eventiArray = Array.isArray(databaseEventi)
            ? databaseEventi
            : Object.keys(databaseEventi).map(key => ({ id: key, ...databaseEventi[key] }));

        if (testoRicerca !== '') {
            eventiArray = eventiArray.filter(dati => {
                const titolo = (dati.titolo || dati.nome || '').toLowerCase();
                const descrizione = (dati.descrizione || '').toLowerCase();
                const luogo = (dati.luogo || dati.provincia || dati.citta || '').toLowerCase();

                return titolo.includes(testoRicerca) ||
                    descrizione.includes(testoRicerca) ||
                    luogo.includes(testoRicerca);
            });
        }

        if (opzioneFiltro === 'vicini') {
            eventiArray.sort((a, b) => (a.distanza || 0) - (b.distanza || 0));
        } else if (opzioneFiltro === 'lontani') {
            eventiArray.sort((a, b) => (b.distanza || 0) - (a.distanza || 0));
        }

        listaContainer.innerHTML = '';

        if (eventiArray.length === 0) {
            listaContainer.innerHTML = '<p class="no-results" style="padding: 1rem; text-align: center; color: #4a3728;">Nessun evento trovato.</p>';
            return;
        }

        eventiArray.forEach(dati => {
            // Nomi delle variabili flessibili per adattarsi a come è scritto dati_eventi.js
            const idEvento = dati.id || '';
            const titoloEvento = dati.titolo || dati.nome || 'Nome non disponibile';
            const immagineEvento = dati.immagineLocandina || dati.immagine || dati.img || './IMAGES/placeholder.jpg';
            const luogoEvento = dati.luogo || dati.provincia || dati.citta || 'Luogo non specificato';
            const dataEvento = dati.data || dati.date || 'Data da definire';

            const cardLink = document.createElement('a');
            cardLink.href = `evento.html?id=${idEvento}`;
            cardLink.className = 'localita-card evento-card';

            cardLink.innerHTML = `
                <div class="card-image-wrapper">
                    <img src="${immagineEvento}" alt="Foto di ${titoloEvento}">
                </div>
                
                <div class="card-info-wrapper">
                    <div class="info-group">
                        <span class="info-label">Nome:</span>
                        <p class="info-value">${titoloEvento}</p>
                    </div>
                    
                    <div class="info-group">
                        <span class="info-label">Data:</span>
                        <p class="info-value">${dataEvento}</p>
                    </div>
                    
                    <div class="info-group">
                        <span class="info-label">Luogo:</span>
                        <p class="info-value">${luogoEvento}</p>
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