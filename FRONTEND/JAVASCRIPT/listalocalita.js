document.addEventListener('DOMContentLoaded', () => {
    const listaContainer = document.getElementById('lista-localita');
    const searchInput = document.getElementById('search-bar');
    const formFiltri = document.getElementById('form-filtri');

    // Rendiamo la funzione globale così lo script filtri.js può vederla e chiamarla
    window.aggiornaVista = function() {
        if (!listaContainer) return;

        const testoRicerca = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const opzioneFiltro = formFiltri ? formFiltri.querySelector('input[name="ordinamento"]:checked')?.value : 'tutti';

        // 1. Recupera i dati dal database statico (se esiste)
        let arrayStatico = typeof databaseLocalita !== 'undefined' ? Object.entries(databaseLocalita) : [];

        // 2. Recupera i dati dalla sessione e normalizza le chiavi
        const localitaSessione = JSON.parse(sessionStorage.getItem('localitaUtente')) || [];
        const arraySessione = localitaSessione.map(loc => {
            return [loc.id, {
                titolo: loc.nome || loc.titolo || "Senza Titolo",
                descrizione: loc.informazione || loc.descrizione || "Nessuna descrizione",
                provincia: loc.provincia || "Non specificata",
                immaginePrincipale: loc.immagine || loc.immaginePrincipale || '../IMAGES/placeholder.jpg'
            }];
        });

        // 3. Unisci i dati statici e quelli della sessione
        let risultati = arrayStatico.concat(arraySessione);

        // 4. Filtro per testo (barra di ricerca)
        if (testoRicerca !== '') {
            risultati = risultati.filter(([id, dati]) => {
                const titolo = (dati.titolo || '').toLowerCase();
                const provincia = (dati.provincia || '').toLowerCase();
                return titolo.includes(testoRicerca) || provincia.includes(testoRicerca);
            });
        }

        // 5. Ordinamento (radio button)
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

    // ==========================================
    // GESTIONE MENÙ A TENDINA (AUTOCOMPLETAMENTO)
    // ==========================================
    if (searchInput) {
        const wrapper = searchInput.closest('.search-input-wrapper') || searchInput.parentElement;
        searchInput.setAttribute('autocomplete', 'off');

        function mostraTendina(filtro = '') {
            chiudiTutteLeTendine();

            // Ottiene tutte le località per il suggerimento
            let arrayStatico = typeof databaseLocalita !== 'undefined' ? Object.values(databaseLocalita) : [];
            const localitaSessione = JSON.parse(sessionStorage.getItem('localitaUtente')) || [];

            const nomiLocalita = [
                ...arrayStatico.map(l => l.titolo || l.nome),
                ...localitaSessione.map(l => l.nome || l.titolo)
            ].filter(Boolean);

            // Elimina i duplicati
            const nomiUnici = [...new Set(nomiLocalita)];

            // Filtra in base a quanto digitato
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
                emptyDiv.textContent = 'Nessuna località trovata';
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
            if (!e.target.closest('.search-input-wrapper') && !e.target.closest('#search-bar')) {
                chiudiTutteLeTendine();
            }
        });
    }

    // Inizializza la visualizzazione
    window.aggiornaVista();
});