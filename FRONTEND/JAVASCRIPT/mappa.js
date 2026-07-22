document.addEventListener('DOMContentLoaded', () => {
    // Coordinate dell'Università degli Studi di Salerno (Campus di Fisciano)
    const latFisciano = 40.7750;
    const lngFisciano = 14.7890;
    const zoomLevel = 15;

    // 1. Inizializza la mappa con zoom e interazione abilitati
    const map = L.map('map', {
        zoomControl: true,
        scrollWheelZoom: true // Abilita lo zoom con la rotella del mouse
    }).setView([latFisciano, lngFisciano], zoomLevel);

    // 2. Tile layer nitido e ad alta visibilità (CartoDB Voyager)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
    }).addTo(map);

    // 3. Marker principale per Fisciano / UniSa con Pop-up
    const unisaMarker = L.marker([latFisciano, lngFisciano]).addTo(map);
    unisaMarker.bindPopup("<b>Università degli Studi di Salerno</b><br>Campus di Fisciano").openPopup();

    // 4. Interattività: Cliccando in un punto qualsiasi della mappa compare un popup con le coordinate
    map.on('click', (e) => {
        const lat = e.latlng.lat.toFixed(4);
        const lng = e.latlng.lng.toFixed(4);

        L.popup()
            .setLatLng(e.latlng)
            .setContent(`<b>Punto Selezionato</b><br>Latitudine: ${lat}<br>Longitudine: ${lng}`)
            .openOn(map);
    });

    // 5. Garantisce che la mappa calcoli correttamente la sua dimensione iniziale
    setTimeout(() => {
        map.invalidateSize();
    }, 250);
});