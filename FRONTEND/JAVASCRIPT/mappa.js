document.addEventListener('DOMContentLoaded', () => {
    // 1. Database delle località con relative coordinate GPS
    const databaseLocalitaMap = [
        { nome: "Fisciano", lat: 40.7750, lng: 14.7890 },
        { nome: "Baronissi", lat: 40.7467, lng: 14.7725 },
        { nome: "Pellezzano", lat: 40.7278, lng: 14.7603 },
        { nome: "Mercato San Severino", lat: 40.7836, lng: 14.7342 },
        { nome: "Calvanico", lat: 40.7792, lng: 14.8353 },
        { nome: "Montoro", lat: 40.8175, lng: 14.7811 },
        { nome: "Bracigliano", lat: 40.8253, lng: 14.7136 },
        { nome: "Siano", lat: 40.8031, lng: 14.6942 },
        { nome: "Castiglione del Genovesi", lat: 40.7361, lng: 14.8503 },
        { nome: "San Cipriano Picentino", lat: 40.7183, lng: 14.8686 }
    ];

    // Coordinate iniziali dell'Università degli Studi di Salerno (Campus di Fisciano)
    const latFisciano = 40.7750;
    const lngFisciano = 14.7890;
    const zoomLevel = 15;

    // 2. Inizializza la mappa disabilitando lo zoom con la rotella del mouse
    const map = L.map('map', {
        zoomControl: true,
        scrollWheelZoom: false
    }).setView([latFisciano, lngFisciano], zoomLevel);

    // 3. Tile layer (CartoDB Voyager)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
    }).addTo(map);

    // Marker dinamico della ricerca
    let searchMarker = null;

    // Marker iniziale di Fisciano / UniSa
    const unisaMarker = L.marker([latFisciano, lngFisciano]).addTo(map);
    unisaMarker.bindPopup("<b>Università degli Studi di Salerno</b><br>Campus di Fisciano").openPopup();

    // 4. Interattività: Cliccando sulla mappa compare un popup con le coordinate
    map.on('click', (e) => {
        const lat = e.latlng.lat.toFixed(4);
        const lng = e.latlng.lng.toFixed(4);

        L.popup()
            .setLatLng(e.latlng)
            .setContent(`<b>Punto Selezionato</b><br>Latitudine: ${lat}<br>Longitudine: ${lng}`)
            .openOn(map);
    });

    // Garantisce che la mappa ricalcoli la sua dimensione iniziale
    setTimeout(() => {
        map.invalidateSize();
    }, 250);

    // ==========================================
    // 5. GESTIONE AUTOCOMPLETAMENTO BARRA DI RICERCA
    // ==========================================
    const searchInput = document.querySelector('.search-input-wrapper .input-search');

    if (searchInput) {
        const wrapper = searchInput.closest('.search-input-wrapper');
        searchInput.setAttribute('autocomplete', 'off');

        function mostraTendina(filtro = '') {
            chiudiTutteLeTendine();

            const listContainer = document.createElement('div');
            listContainer.classList.add('autocomplete-list');
            wrapper.appendChild(listContainer);

            // Filtra le località
            const corrispondenze = databaseLocalitaMap.filter(item =>
                item.nome.toLowerCase().includes(filtro.toLowerCase())
            );

            if (corrispondenze.length === 0) {
                const emptyDiv = document.createElement('div');
                emptyDiv.classList.add('autocomplete-item');
                emptyDiv.style.fontStyle = 'italic';
                emptyDiv.style.color = '#888';
                emptyDiv.textContent = 'Nessuna località trovata';
                listContainer.appendChild(emptyDiv);
                return;
            }

            corrispondenze.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('autocomplete-item');

                if (filtro.trim() !== '') {
                    const matchIndex = item.nome.toLowerCase().indexOf(filtro.toLowerCase());
                    const prima = item.nome.substring(0, matchIndex);
                    const coincidenza = item.nome.substring(matchIndex, matchIndex + filtro.length);
                    const dopo = item.nome.substring(matchIndex + filtro.length);
                    itemDiv.innerHTML = `${prima}<strong>${coincidenza}</strong>${dopo}`;
                } else {
                    itemDiv.textContent = item.nome;
                }

                // Selezione della località: centra la mappa e mette un marker
                itemDiv.addEventListener('mousedown', function (e) {
                    e.preventDefault();
                    searchInput.value = item.nome;
                    chiudiTutteLeTendine();

                    // Sposta la mappa sul luogo selezionato
                    map.flyTo([item.lat, item.lng], 15, { duration: 1.2 });

                    // Rimuove l'eventuale marker precedente e ne aggiunge uno nuovo
                    if (searchMarker) {
                        map.removeLayer(searchMarker);
                    }
                    searchMarker = L.marker([item.lat, item.lng]).addTo(map);
                    searchMarker.bindPopup(`<b>${item.nome}</b><br>Località selezionata`).openPopup();
                });

                listContainer.appendChild(itemDiv);
            });
        }

        // Mostra la tendina con tutte le località al click/focus
        searchInput.addEventListener('focus', function () {
            mostraTendina(this.value.trim());
        });

        searchInput.addEventListener('click', function () {
            mostraTendina(this.value.trim());
        });

        // Filtra in tempo reale digitando
        searchInput.addEventListener('input', function () {
            mostraTendina(this.value.trim());
        });
    }

    function chiudiTutteLeTendine() {
        const liste = document.querySelectorAll('.autocomplete-list');
        liste.forEach(lista => lista.remove());
    }

    // Chiude il menù a tendina se si clicca fuori dalla barra di ricerca
    document.addEventListener('click', function (e) {
        if (!e.target.closest('.search-input-wrapper')) {
            chiudiTutteLeTendine();
        }
    });
});