document.addEventListener('DOMContentLoaded', () => {
    // Selettori Modal e Lista
    const modal = document.getElementById('itinerary-modal');
    const closeBtn = document.querySelector('.close-btn');
    const itinerariList = document.querySelector('.itinerari-list');

    // Selettori per Ricerca e Popover Filtri
    const searchInput = document.getElementById('search-bar');
    const formFiltri = document.getElementById('form-filtri');
    const btnElimina = document.querySelector('.btn-modify-itinerary');

    // 1. Legge gli itinerari salvati dal localStorage
    let itinerari = JSON.parse(localStorage.getItem('itinerari')) || [];

    // 2. FUNZIONE PER FILTRARE, ORDINARE E MOSTRARE LE CARD
    function aggiornaVista() {
        if (!itinerariList) return;

        const testoRicerca = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const opzioneFiltro = formFiltri ? formFiltri.querySelector('input[name="ordinamento"]:checked')?.value : 'tutti';

        let risultati = itinerari.filter(item => {
            const titolo = (item.titolo || '').toLowerCase();
            const partenza = (item.partenza || '').toLowerCase();
            const arrivo = (item.arrivo || '').toLowerCase();
            return titolo.includes(testoRicerca) || partenza.includes(testoRicerca) || arrivo.includes(testoRicerca);
        });

        if (opzioneFiltro === 'lunghi') {
            risultati.sort((a, b) => (b.durata || b.tappe?.length || 0) - (a.durata || a.tappe?.length || 0));
        } else if (opzioneFiltro === 'corti') {
            risultati.sort((a, b) => (a.durata || a.tappe?.length || 0) - (b.durata || b.tappe?.length || 0));
        } else if (opzioneFiltro === 'az') {
            risultati.sort((a, b) => a.titolo.localeCompare(b.titolo));
        }

        itinerariList.innerHTML = '';

        if (risultati.length === 0) {
            itinerariList.innerHTML = '<p class="no-results" style="padding: 1rem; text-align: center; color: #4a3728;">Nessun itinerario trovato.</p>';
            return;
        }

        risultati.forEach(itinerario => {
            const card = document.createElement('button');
            card.classList.add('itinerario-card');
            card.dataset.id = itinerario.id; // Assegna l'ID alla card
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
            const popover = document.getElementById('popover-filtro');
            if (popover) popover.classList.remove('show');
        });
    }

    // Caricamento iniziale
    aggiornaVista();

    // 4. APERTURA POPUP E CARICAMENTO DATI
    if (itinerariList) {
        itinerariList.addEventListener('click', (e) => {
            const card = e.target.closest('.itinerario-card');

            if (card) {
                const id = card.dataset.id;
                const selezionato = itinerari.find(item => item.id == id);

                if (selezionato) {
                    const titleEl = document.querySelector('.popup-route-title');
                    if (titleEl) titleEl.textContent = selezionato.titolo;

                    const infoLines = document.querySelectorAll('.popup-info-line');
                    if (infoLines.length >= 2) {
                        infoLines[0].textContent = `Partenza: ${selezionato.partenza || 'N/D'}`;
                        infoLines[1].textContent = `Arrivo: ${selezionato.arrivo || 'N/D'}`;
                    }

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

                    // Associa l'ID dell'itinerario selezionato al bottone "Elimina"
                    if (btnElimina) {
                        btnElimina.dataset.id = id;
                    }

                    if (modal) modal.classList.add('show');
                }
            }
        });
    }

    // 5. ELIMINAZIONE ITINERARIO
    if (btnElimina) {
        btnElimina.addEventListener('click', function() {
            const idDaEliminare = this.dataset.id;

            if (idDaEliminare) {
                // Rimuove l'itinerario dall'array principale
                itinerari = itinerari.filter(item => item.id != idDaEliminare);

                // Aggiorna il localStorage con il nuovo array
                localStorage.setItem('itinerari', JSON.stringify(itinerari));

                // Chiude il popup ripristinando la classe corretta
                if (modal) {
                    modal.classList.remove('show');
                }

                // Ricarica la lista a schermo
                aggiornaVista();
            }
        });
    }

    // 6. CHIUSURA POPUP (X e click fuori dal modal)
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