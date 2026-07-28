document.addEventListener('DOMContentLoaded', () => {
    const listaContainer = document.getElementById('lista-eventi');
    const searchInput = document.getElementById('search-bar');
    const formFiltri = document.getElementById('form-filtri');

    // Rendiamo la funzione globale così lo script filtri.js può vederla e chiamarla
    window.aggiornaVista = function() {
        if (!listaContainer) return;

        const testoRicerca = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const opzioneFiltro = formFiltri ? formFiltri.querySelector('input[name="ordinamento"]:checked')?.value : 'tutti';

        // 1. Recupera i dati dal database statico (se esiste) e normalizza in array di coppie [id, dati]
        let arrayStatico = [];
        if (typeof databaseEventi !== 'undefined') {
            if (Array.isArray(databaseEventi)) {
                arrayStatico = databaseEventi.map(ev => [ev.id, ev]);
            } else {
                arrayStatico = Object.entries(databaseEventi);
            }
        }

        // 2. Recupera i dati dalla sessione e normalizza le chiavi
        const eventiSessione = JSON.parse(sessionStorage.getItem('eventiUtente')) || [];
        const arraySessione = eventiSessione.map(ev => {
            return [ev.id, {
                titolo: ev.titolo || ev.nome || "Senza Titolo",
                descrizione: ev.descrizione || "Nessuna descrizione",
                luogo: ev.luogo || ev.indirizzo || ev.provincia || "Non specificato",
                immaginePrincipale: ev.immaginePrincipale || ev.immagineLocandina || ev.img || '../IMAGES/placeholder.jpg'
            }];
        });

        // 3. Unisci i dati della sessione in cima a quelli statici
        let risultati = arraySessione.concat(arrayStatico);

        // 4. Filtro per testo (barra di ricerca)
        if (testoRicerca !== '') {
            risultati = risultati.filter(([id, dati]) => {
                const titolo = (dati.titolo || dati.nome || '').toLowerCase();
                const luogo = (dati.luogo || dati.indirizzo || dati.provincia || '').toLowerCase();
                const descrizione = (dati.descrizione || '').toLowerCase();

                return titolo.includes(testoRicerca) ||
                    luogo.includes(testoRicerca) ||
                    descrizione.includes(testoRicerca);
            });
        }

        // 5. Ordinamento (radio button)
        if (opzioneFiltro === 'az') {
            risultati.sort((a, b) => (a[1].titolo || a[1].nome || '').localeCompare(b[1].titolo || b[1].nome || ''));
        } else if (opzioneFiltro === 'za') {
            risultati.sort((a, b) => (b[1].titolo || b[1].nome || '').localeCompare(a[1].titolo || a[1].nome || ''));
        }

        // Svuota e riempie la lista
        listaContainer.innerHTML = '';

        if (risultati.length === 0) {
            listaContainer.innerHTML = '<p class="no-results" style="padding: 1rem; text-align: center; color: #4a3728;">Nessun evento trovato.</p>';
            return;
        }

        risultati.forEach(([id, dati]) => {
            const idEvento = id || dati.id || '';
            const titoloEvento = dati.titolo || dati.nome || 'Evento senza nome';
            const immagineEvento = dati.immaginePrincipale || dati.immagineLocandina || dati.img || '../IMAGES/placeholder.jpg';
            const descrizioneEvento = dati.descrizione || 'Nessuna descrizione disponibile';
            const luogoEvento = dati.luogo || dati.indirizzo || dati.provincia || 'Luogo non specificato';

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

    // ==========================================
    // GESTIONE MENÙ A TENDINA (AUTOCOMPLETAMENTO)
    // ==========================================
    if (searchInput) {
        const wrapper = searchInput.closest('.search-wrapper') || searchInput.parentElement;
        searchInput.setAttribute('autocomplete', 'off');

        function mostraTendina(filtro = '') {
            chiudiTutteLeTendine();

            // Ottiene tutti i nomi di eventi disponibili per il suggerimento
            let arrayStatico = typeof databaseEventi !== 'undefined'
                ? (Array.isArray(databaseEventi) ? databaseEventi : Object.values(databaseEventi))
                : [];
            const eventiSessione = JSON.parse(sessionStorage.getItem('eventiUtente')) || [];

            const nomiEventi = [
                ...arrayStatico.map(e => e.nome || e.titolo),
                ...eventiSessione.map(e => e.nome || e.titolo)
            ].filter(Boolean);

            // Rimuove eventuali duplicati
            const nomiUnici = [...new Set(nomiEventi)];

            // Filtra in base a quanto digitato dall'utente
            const corrispondenze = nomiUnici.filter(nome =>
                nome.toLowerCase().includes(filtro.toLowerCase())
            );

            const listContainer = document.createElement('div');
            listContainer.classList.add('autocomplete-list');
            wrapper.appendChild(listContainer);

            if (corrispondenze.length === 0) {
                const emptyDiv = document.createElement('div');
                emptyDiv.classList.add('autocomplete-item');
                emptyDiv.style.fontStyle = 'italic';
                emptyDiv.style.color = '#888';
                emptyDiv.textContent = 'Nessun evento trovato';
                listContainer.appendChild(emptyDiv);
                return;
            }

            corrispondenze.forEach(nome => {
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('autocomplete-item');

                if (filtro.trim() !== '') {
                    const matchIndex = nome.toLowerCase().indexOf(filtro.toLowerCase());
                    const prima = nome.substring(0, matchIndex);
                    const coincidenza = nome.substring(matchIndex, matchIndex + filtro.length);
                    const dopo = nome.substring(matchIndex + filtro.length);
                    itemDiv.innerHTML = `${prima}<strong>${coincidenza}</strong>${dopo}`;
                } else {
                    itemDiv.textContent = nome;
                }

                itemDiv.addEventListener('mousedown', function (e) {
                    e.preventDefault();
                    searchInput.value = nome;
                    chiudiTutteLeTendine();
                    window.aggiornaVista();
                });

                listContainer.appendChild(itemDiv);
            });
        }

        function chiudiTutteLeTendine() {
            const liste = document.querySelectorAll('.autocomplete-list');
            liste.forEach(lista => lista.remove());
        }

        searchInput.addEventListener('focus', function () {
            mostraTendina(this.value.trim());
        });

        searchInput.addEventListener('click', function () {
            mostraTendina(this.value.trim());
        });

        searchInput.addEventListener('input', function () {
            mostraTendina(this.value.trim());
            window.aggiornaVista();
        });

        document.addEventListener('click', function (e) {
            if (!e.target.closest('.search-wrapper') && !e.target.closest('#search-bar')) {
                chiudiTutteLeTendine();
            }
        });
    }

    // Inizializza la visualizzazione
    window.aggiornaVista();
});