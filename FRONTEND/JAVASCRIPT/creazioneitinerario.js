// Array locale per contenere le tappe visibili nell'itinerario
let tappeItinerario = [];

// Database generale delle località con orario stimato e chilometraggio assoluto
const databaseLocalita = [
    { nome: "Napoli", orario: "09:00", km: 0 },
    { nome: "Salerno", orario: "10:30", km: 55 },
    { nome: "Vietri sul Mare", orario: "11:15", km: 60 },
    { nome: "Cetara", orario: "12:00", km: 66 },
    { nome: "Maiori", orario: "13:00", km: 78 },
    { nome: "Minori", orario: "14:30", km: 80 },
    { nome: "Atrani", orario: "15:15", km: 83 },
    { nome: "Amalfi", orario: "16:00", km: 84 },
    { nome: "Positano", orario: "17:45", km: 100 },
    { nome: "Sorrento", orario: "19:00", km: 115 }
];

/**
 * Funzione per attivare il menù a tendina con autocompletamento su un campo di input
 */
function setupAutocomplete(inputElement) {
    const wrapper = inputElement.closest('.search-input-wrapper');

    // Disabilita l'autocompletamento di default del browser
    inputElement.setAttribute('autocomplete', 'off');

    // Evento alla digitazione nell'input
    inputElement.addEventListener('input', function () {
        const val = this.value.trim();

        // Chiude eventuali liste già aperte
        closeAllAutocompleteLists();

        if (!val) return;

        // Crea il contenitore della tendina
        const listContainer = document.createElement('div');
        listContainer.classList.add('autocomplete-list');
        wrapper.appendChild(listContainer);

        // Filtra le località del database in base al testo digitato
        const corrispondenze = databaseLocalita.filter(item =>
            item.nome.toLowerCase().includes(val.toLowerCase())
        );

        if (corrispondenze.length === 0) {
            closeAllAutocompleteLists();
            return;
        }

        // Genera gli elementi della lista
        corrispondenze.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('autocomplete-item');

            // Evidenzia in grassetto la parte di testo che combacia
            const matchIndex = item.nome.toLowerCase().indexOf(val.toLowerCase());
            const prima = item.nome.substring(0, matchIndex);
            const coincidenza = item.nome.substring(matchIndex, matchIndex + val.length);
            const dopo = item.nome.substring(matchIndex + val.length);

            itemDiv.innerHTML = `${prima}<strong>${coincidenza}</strong>${dopo}`;

            // Selezione della località al click
            itemDiv.addEventListener('click', function () {
                inputElement.value = item.nome;
                closeAllAutocompleteLists();
            });

            listContainer.appendChild(itemDiv);
        });
    });

    // Chiude la tendina cliccando in un punto qualsiasi fuori dall'input
    document.addEventListener('click', function (e) {
        if (e.target !== inputElement) {
            closeAllAutocompleteLists();
        }
    });
}

/**
 * Rimuove tutti i menù a tendina aperti nel DOM
 */
function closeAllAutocompleteLists() {
    const liste = document.querySelectorAll('.autocomplete-list');
    liste.forEach(lista => lista.remove());
}

/**
 * Estrae il segmento di tappe tra due località e ricalcola le distanze relative.
 */
function calcolaSequenzaItinerario(partenza, arrivo) {
    const normalize = str => str.trim().toLowerCase();

    const startIndex = databaseLocalita.findIndex(item => normalize(item.nome) === normalize(partenza));
    const endIndex = databaseLocalita.findIndex(item => normalize(item.nome) === normalize(arrivo));

    if (startIndex === -1 || endIndex === -1) {
        return null;
    }

    let segmento = [];
    if (startIndex <= endIndex) {
        segmento = databaseLocalita.slice(startIndex, endIndex + 1);
    } else {
        segmento = databaseLocalita.slice(endIndex, startIndex + 1).reverse();
    }

    const kmIniziali = segmento[0].km;

    return segmento.map(tappa => ({
        nome: tappa.nome,
        orario: tappa.orario,
        distanza: `${Math.abs(tappa.km - kmIniziali)} km`
    }));
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-creazione-itinerario');
    const propostoBox = document.getElementById('itinerario-proposto-box');
    const btnGenera = document.querySelector('.btn-genera');
    const btnReset = document.getElementById('btn-reset');

    const inputTitolo = document.getElementById('itinerario-titolo');
    const inputPartenza = document.getElementById('itinerario-partenza');
    const inputArrivo = document.getElementById('itinerario-arrivo');

    // Attiva il menù a tendina sui due campi di ricerca
    if (inputPartenza) setupAutocomplete(inputPartenza);
    if (inputArrivo) setupAutocomplete(inputArrivo);

    /**
     * Rendering grafico delle tappe
     */
    function renderTappe() {
        if (!propostoBox) return;

        propostoBox.innerHTML = '';

        if (tappeItinerario.length === 0) {
            propostoBox.innerHTML = `
                <p style="text-align: center; color: #633A1C; margin: 20px 0; font-style: italic;">
                    Inserisci partenza e arrivo, poi clicca su "Genera" per visualizzare le tappe.
                </p>`;
            return;
        }

        tappeItinerario.forEach((tappa, index) => {
            const tappaElement = document.createElement('div');
            tappaElement.classList.add('tappa-item');

            tappaElement.innerHTML = `
                <div class="tappa-chip">${tappa.nome}</div>
                <div class="tappa-chip">${tappa.orario}</div>
                <div class="tappa-chip">${tappa.distanza}</div>
                
                <div class="tappa-actions">
                    <button type="button" class="action-btn btn-matita" data-index="${index}" aria-label="Modifica tappa">
                        <svg viewBox="0 0 24 24" fill="none" stroke="#6E8B3D" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M12 20h9"></path>
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                        </svg>
                    </button>
                    <button type="button" class="action-btn btn-elimina-tappa" data-index="${index}" aria-label="Elimina tappa">
                        <svg viewBox="0 0 24 24" fill="none" stroke="#C23305" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
            `;

            propostoBox.appendChild(tappaElement);
        });
    }

    // Generazione della sequenza
    if (btnGenera) {
        btnGenera.addEventListener('click', () => {
            const partenzaVal = inputPartenza ? inputPartenza.value : '';
            const arrivoVal = inputArrivo ? inputArrivo.value : '';

            if (!partenzaVal.trim() || !arrivoVal.trim()) {
                alert('Compila sia il campo Partenza che Arrivo.');
                return;
            }

            const risultato = calcolaSequenzaItinerario(partenzaVal, arrivoVal);

            if (risultato) {
                tappeItinerario = risultato;
                renderTappe();
            } else {
                alert(`Nessuna sequenza trovata tra "${partenzaVal}" e "${arrivoVal}". Seleziona località valide dai suggerimenti.`);
            }
        });
    }

    // Gestione Modifica / Eliminazione Tappe
    if (propostoBox) {
        propostoBox.addEventListener('click', (e) => {
            const btnDelete = e.target.closest('.btn-elimina-tappa');
            if (btnDelete) {
                const index = parseInt(btnDelete.dataset.index, 10);
                tappeItinerario.splice(index, 1);
                renderTappe();
                return;
            }

            const btnEdit = e.target.closest('.btn-matita');
            if (btnEdit) {
                const index = parseInt(btnEdit.dataset.index, 10);
                const tappa = tappeItinerario[index];

                const nuovoNome = prompt('Modifica luogo:', tappa.nome);
                if (nuovoNome && nuovoNome.trim()) tappa.nome = nuovoNome.trim();

                const nuovoOrario = prompt('Modifica orario:', tappa.orario);
                if (nuovoOrario && nuovoOrario.trim()) tappa.orario = nuovoOrario.trim();

                const nuovaDistanza = prompt('Modifica distanza:', tappa.distanza);
                if (nuovaDistanza && nuovaDistanza.trim()) tappa.distanza = nuovaDistanza.trim();

                renderTappe();
            }
        });
    }

    // Reset
    if (btnReset) {
        btnReset.addEventListener('click', () => {
            tappeItinerario = [];
            if (form) form.reset();
            closeAllAutocompleteLists();
            renderTappe();
        });
    }

    // Salvataggio Itinerario
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            if (tappeItinerario.length === 0) {
                alert('Genera prima un itinerario valido.');
                return;
            }

            const nuovoItinerario = {
                id: Date.now(),
                titolo: inputTitolo ? inputTitolo.value.trim() : 'Senza Titolo',
                partenza: inputPartenza ? inputPartenza.value.trim() : '',
                arrivo: inputArrivo ? inputArrivo.value.trim() : '',
                tappe: tappeItinerario
            };

            const esistenti = JSON.parse(localStorage.getItem('itinerari')) || [];
            esistenti.push(nuovoItinerario);
            localStorage.setItem('itinerari', JSON.stringify(esistenti));

            const modal = document.getElementById('modal-successo');
            const btnOk = document.getElementById('btn-modal-ok');

            if (modal) {
                modal.classList.add('show');
                if (btnOk) {
                    btnOk.addEventListener('click', () => {
                        window.location.href = 'itinerari.html';
                    });
                }
            } else {
                alert('Itinerario salvato correttamente!');
                window.location.href = 'itinerari.html';
            }
        });
    }

    renderTappe();
});