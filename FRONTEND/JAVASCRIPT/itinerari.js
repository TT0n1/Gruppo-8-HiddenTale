document.addEventListener('DOMContentLoaded', () => {
    // Selettori Modal e Lista (i tuoi originali)
    const modal = document.getElementById('itinerary-modal');
    const closeBtn = document.querySelector('.close-btn');
    const itinerariList = document.querySelector('.itinerari-list');

    // Nuovi selettori per Ricerca e Popover Filtri
    const searchInput = document.getElementById('search-bar');
    const formFiltri = document.getElementById('form-filtri');

    // 1. Legge gli itinerari salvati dal localStorage
    const itinerari = JSON.parse(localStorage.getItem('itinerari')) || [];

    // 2. FUNZIONE PER FILTRARE, ORDINARE E MOSTRARE LE CARD
    function aggiornaVista() {
        if (!itinerariList) return;

        // A. Testo digitato nella barra di ricerca
        const testoRicerca = searchInput ? searchInput.value.toLowerCase().trim() : '';

        // B. Opzione selezionata nel form filtri (es. 'tutti', 'lunghi', 'corti', 'az')
        const opzioneFiltro = formFiltri ? formFiltri.querySelector('input[name="ordinamento"]:checked')?.value : 'tutti';

        // C. Filtra per testo (cerca nel titolo, partenza o arrivo)
        let risultati = itinerari.filter(item => {
            const titolo = (item.titolo || '').toLowerCase();
            const partenza = (item.partenza || '').toLowerCase();
            const arrivo = (item.arrivo || '').toLowerCase();
            return titolo.includes(testoRicerca) || partenza.includes(testoRicerca) || arrivo.includes(testoRicerca);
        });

        // D. Ordina i risultati
        if (opzioneFiltro === 'lunghi') {
            risultati.sort((a, b) => (b.durata || b.tappe?.length || 0) - (a.durata || a.tappe?.length || 0));
        } else if (opzioneFiltro === 'corti') {
            risultati.sort((a, b) => (a.durata || a.tappe?.length || 0) - (b.durata || b.tappe?.length || 0));
        } else if (opzioneFiltro === 'az') {
            risultati.sort((a, b) => a.titolo.localeCompare(b.titolo));
        }

        // E. Svuota la lista e genera le nuove card
        itinerariList.innerHTML = '';

        if (risultati.length === 0) {
            itinerariList.innerHTML = '<p class="no-results" style="padding: 1rem; color: #666;">Nessun itinerario trovato.</p>';
            return;
        }

        risultati.forEach(itinerario => {
            const card = document.createElement('button');
            card.classList.add('itinerario-card');
            card.dataset.id = itinerario.id;
            card.innerHTML = `
                <span>${itinerario.titolo}</span>
                <svg class="arrow-down-icon" viewBox="0 0 24 24" width="20" height="20">
                    <path d="M19 9l-7 7-7-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `;
            itinerariList.appendChild(card);
        });
    }

    // 3. LISTENERS PER EVENTI DI RICERCA E FILTRO
    if (searchInput) {
        searchInput.addEventListener('input', aggiornaVista);
    }

    if (formFiltri) {
        formFiltri.addEventListener('change', () => {
            aggiornaVista();
            // Chiude la tendina dei filtri dopo la selezione
            const popover = document.getElementById('popover-filtro');
            if (popover) popover.classList.remove('show');
        });
    }

    // Caricamento iniziale della lista
    aggiornaVista();

    // 4. APERTURA POPUP (Codice originale intatto)
    if (itinerariList) {
        itinerariList.addEventListener('click', (e) => {
            const card = e.target.closest('.itinerario-card');
            
            if (card) {
                const id = card.dataset.id;
                const selezionato = itinerari.find(item => item.id == id);

                // Se l'itinerario esiste in memoria, aggiorna i testi del popup
                if (selezionato) {
                    // Titolo
                    const titleEl = document.querySelector('.popup-route-title');
                    if (titleEl) titleEl.textContent = selezionato.titolo;

                    // Partenza e Arrivo
                    const infoLines = document.querySelectorAll('.popup-info-line');
                    if (infoLines.length >= 2) {
                        infoLines[0].textContent = `Partenza: ${selezionato.partenza || 'N/D'}`;
                        infoLines[1].textContent = `Arrivo: ${selezionato.arrivo || 'N/D'}`;
                    }

                    // Tappe
                    const gridBox = document.querySelector('.itinerary-grid-box');
                    if (gridBox && selezionato.tappe) {
                        gridBox.innerHTML = '';
                        selezionato.tappe.forEach(tappa => {
                            const row = document.createElement('div');
                            row.classList.add('itinerary-grid-row');
                            row.innerHTML = `
                                <div class="pill-box stage-name">${tappa.nome || tappa}</div>
                                <div class="pill-box stage-time">${tappa.orario || '--:--'}</div>
                                <div class="pill-box stage-dist">${tappa.distanza || '5Km'}</div>
                            `;
                            gridBox.appendChild(row);
                        });
                    }
                }

                // Apri il popup aggiungendo la classe .show
                if (modal) modal.classList.add('show');
            }
        });
    }

    // 5. CHIUSURA POPUP (Codice originale intatto)
    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('show');
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
    }
});