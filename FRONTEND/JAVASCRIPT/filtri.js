document.addEventListener('DOMContentLoaded', () => {
    // 1. Cerca prima tramite l'ID specifico, altrimenti usa la classe del bottone
    const btnFiltro = document.getElementById('btn-filter') || document.querySelector('.filter-button');
    const popoverFiltro = document.getElementById('popover-filtro');
    const formFiltri = document.getElementById('form-filtri');

    if (btnFiltro && popoverFiltro) {
        // Apertura e chiusura al click sul bottone
        btnFiltro.addEventListener('click', (e) => {
            e.stopPropagation(); // Impedisce la chiusura immediata
            popoverFiltro.classList.toggle('show');
        });

        // Chiudi se si clicca ovunque all'esterno
        document.addEventListener('click', (e) => {
            if (!popoverFiltro.contains(e.target) && !btnFiltro.contains(e.target)) {
                popoverFiltro.classList.remove('show');
            }
        });
    }

    // Gestione della scelta delle opzioni nel filtro
    if (formFiltri) {
        formFiltri.addEventListener('change', (e) => {
            const opzioneSelezionata = e.target.value;

            // Se esiste la funzione di ordinamento nella pagina (es. in itinerari.js), la esegue
            if (typeof aggiornaVista === 'function') {
                aggiornaVista();
            } else if (typeof ordinaItinerari === 'function') {
                ordinaItinerari(opzioneSelezionata);
            }

            // Chiude la tendina dopo aver selezionato un'opzione
            if (popoverFiltro) {
                popoverFiltro.classList.remove('show');
            }
        });
    }
});