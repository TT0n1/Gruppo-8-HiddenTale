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
        const opzioneFiltro = formFiltri ? formFiltri.querySelector('input[name="ordinamento"]:checked')?.value : 'tutti';

        // 1. Recupera gli eventi base dal file JS statico
        let eventiBase = Array.isArray(databaseEventi)
            ? databaseEventi
            : Object.keys(databaseEventi).map(key => ({ id: key, ...databaseEventi[key] }));

        // 2. Recupera gli eventi creati dall'utente salvati in sessione
        const eventiSessione = JSON.parse(sessionStorage.getItem('eventiUtente')) || [];

        // 3. Unisce i due array (mettendo in cima i nuovi eventi creati)
        let tuttiGliEventi = [...eventiSessione, ...eventiBase];

        // 4. Filtro per testo (barra di ricerca)
        if (testoRicerca !== '') {
            tuttiGliEventi = tuttiGliEventi.filter(dati => {
                const titolo = (dati.titolo || dati.nome || '').toLowerCase();
                const luogo = (dati.luogo || dati.provincia || '').toLowerCase();
                const descrizione = (dati.descrizione || '').toLowerCase();

                return titolo.includes(testoRicerca) ||
                    luogo.includes(testoRicerca) ||
                    descrizione.includes(testoRicerca);
            });
        }

        // 5. Ordinamento
        if (opzioneFiltro === 'az') {
            tuttiGliEventi.sort((a, b) => (a.titolo || a.nome || '').localeCompare(b.titolo || b.nome || ''));
        } else if (opzioneFiltro === 'za') {
            tuttiGliEventi.sort((a, b) => (b.titolo || b.nome || '').localeCompare(a.titolo || a.nome || ''));
        }

        // Svuota e riempie il contenitore
        listaContainer.innerHTML = '';

        if (tuttiGliEventi.length === 0) {
            listaContainer.innerHTML = '<p class="no-results" style="padding: 1rem; text-align: center; color: #4a3728;">Nessun evento trovato.</p>';
            return;
        }

        tuttiGliEventi.forEach(dati => {
            const idEvento = dati.id || '';
            const titoloEvento = dati.titolo || dati.nome || 'Evento senza nome';
            const immagineEvento = dati.immaginePrincipale || dati.immagineLocandina || dati.img || '../IMAGES/placeholder.jpg';
            const descrizioneEvento = dati.descrizione || 'Nessuna descrizione disponibile';
            const luogoEvento = dati.luogo || dati.provincia || 'Luogo non specificato';

            const cardLink = document.createElement('a');
            cardLink.href = `evento.html?id=${idEvento}`;
            cardLink.className = 'evento-card';

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
                        <span class="info-label">Descrizione:</span>
                        <p class="info-value">${descrizioneEvento}</p>
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