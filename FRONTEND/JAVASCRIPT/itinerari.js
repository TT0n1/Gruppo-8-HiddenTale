document.addEventListener('DOMContentLoaded', () => {
    // Selettori basati esattamente sul tuo HTML
    const modal = document.getElementById('itinerary-modal');
    const closeBtn = document.querySelector('.close-btn');
    const itinerariList = document.querySelector('.itinerari-list');

    // 1. Legge gli itinerari salvati dal localStorage
    const itinerari = JSON.parse(localStorage.getItem('itinerari')) || [];

    // 2. Se ci sono itinerari nel localStorage, li mostra dinamicamente nella lista
    if (itinerariList && itinerari.length > 0) {
        itinerariList.innerHTML = ''; // Svuolta le card statiche per mettere quelle dinamiche

        itinerari.forEach(itinerario => {
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

    // 3. APERTURA POPUP (Funziona sia con le card dinamiche che con quelle fisse nell'HTML)
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

    // 4. CHIUSURA POPUP
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