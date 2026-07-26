// Array locale per contenere le tappe visibili nell'itinerario
let tappeItinerario = [];

// Database generale delle località con orario stimato e chilometraggio assoluto
const databaseLocalita = [
    { nome: "Fisciano", orario: "09:00", km: 0 },
    { nome: "Baronissi", orario: "09:45", km: 6 },
    { nome: "Pellezzano", orario: "10:30", km: 12 },
    { nome: "Mercato San Severino", orario: "11:30", km: 22 },
    { nome: "Calvanico", orario: "12:30", km: 32 },
    { nome: "Montoro", orario: "14:00", km: 42 },
    { nome: "Bracigliano", orario: "15:00", km: 50 },
    { nome: "Siano", orario: "16:00", km: 58 },
    { nome: "Castiglione del Genovesi", orario: "17:15", km: 75 },
    { nome: "San Cipriano Picentino", orario: "18:15", km: 82 }
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

            // Se la tappa è in modalità modifica, mostra i campi di testo nel rettangolo
            if (tappa.isEditing) {
                tappaElement.innerHTML = `
                    <input type="text" class="tappa-edit-input edit-nome" value="${tappa.nome}" placeholder="Luogo">
                    <input type="text" class="tappa-edit-input edit-orario" value="${tappa.orario}" placeholder="Orario">
                    <input type="text" class="tappa-edit-input edit-distanza" value="${tappa.distanza}" placeholder="Distanza">
                    
                    <div class="tappa-actions">
                        <button type="button" class="action-btn btn-conferma-edit" data-index="${index}" aria-label="Conferma modifica">
                            <svg viewBox="0 0 24 24" fill="none" stroke="#6E8B3D" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </button>
                        <button type="button" class="action-btn btn-annulla-edit" data-index="${index}" aria-label="Annulla modifica">
                            <svg viewBox="0 0 24 24" fill="none" stroke="#C23305" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                `;
            } else {
                // Modalità visualizzazione standard
                tappaElement.innerHTML = `
                    <div class="tappa-chip">${tappa.nome}</div>
                    <div class="tappa-chip">${tappa.orario}</div>
                    <div class="tappa-chip">${tappa.distanza}</div>
                    
                    <div class="tappa-actions">
                        <button type="button" class="action-btn btn-matita" data-index="${index}" aria-label="Modifica tappa">
                            <svg viewBox="0 0 24 24" fill="none" stroke="#B59652" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
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
            }

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

    // Gestione Modifica / Eliminazione Tappe tramite Modifica In-Line
    if (propostoBox) {
        propostoBox.addEventListener('click', (e) => {
            // Elimina tappa
            const btnDelete = e.target.closest('.btn-elimina-tappa');
            if (btnDelete) {
                const index = parseInt(btnDelete.dataset.index, 10);
                tappeItinerario.splice(index, 1);
                renderTappe();
                return;
            }

            // Click sulla matita per attivare la modifica interna al rettangolo
            const btnEdit = e.target.closest('.btn-matita');
            if (btnEdit) {
                const index = parseInt(btnEdit.dataset.index, 10);
                tappeItinerario[index].isEditing = true;
                renderTappe();
                return;
            }

            // Salva modifiche effettuate nella riga
            const btnConferma = e.target.closest('.btn-conferma-edit');
            if (btnConferma) {
                const index = parseInt(btnConferma.dataset.index, 10);
                const parentRow = btnConferma.closest('.tappa-item');

                const valNome = parentRow.querySelector('.edit-nome').value.trim();
                const valOrario = parentRow.querySelector('.edit-orario').value.trim();
                const valDistanza = parentRow.querySelector('.edit-distanza').value.trim();

                if (valNome) tappeItinerario[index].nome = valNome;
                if (valOrario) tappeItinerario[index].orario = valOrario;
                if (valDistanza) tappeItinerario[index].distanza = valDistanza;

                tappeItinerario[index].isEditing = false;
                renderTappe();
                return;
            }

            // Annulla modifica
            const btnAnnulla = e.target.closest('.btn-annulla-edit');
            if (btnAnnulla) {
                const index = parseInt(btnAnnulla.dataset.index, 10);
                tappeItinerario[index].isEditing = false;
                renderTappe();
                return;
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

            // Pulisce la proprietà isEditing prima di salvare
            const tappeDaSalvare = tappeItinerario.map(({ isEditing, ...rest }) => rest);

            const nuovoItinerario = {
                id: Date.now(),
                titolo: inputTitolo ? inputTitolo.value.trim() : 'Senza Titolo',
                partenza: inputPartenza ? inputPartenza.value.trim() : '',
                arrivo: inputArrivo ? inputArrivo.value.trim() : '',
                tappe: tappeDaSalvare
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