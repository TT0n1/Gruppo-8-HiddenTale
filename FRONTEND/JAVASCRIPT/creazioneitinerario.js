// Array locale per contenere le tappe visibili nell'itinerario
let tappeItinerario = [];

// Database generale con il tempo di percorrenza SINGOLO da ciascuna località a quella successiva
const databaseLocalita = [
    { nome: "Fisciano", tempoDaPrecedente: 0, km: 0 },
    { nome: "Baronissi", tempoDaPrecedente: 10, km: 6 },
    { nome: "Pellezzano", tempoDaPrecedente: 10, km: 12 },
    { nome: "Mercato San Severino", tempoDaPrecedente: 15, km: 22 },
    { nome: "Calvanico", tempoDaPrecedente: 15, km: 32 },
    { nome: "Montoro", tempoDaPrecedente: 15, km: 42 },
    { nome: "Bracigliano", tempoDaPrecedente: 15, km: 50 },
    { nome: "Siano", tempoDaPrecedente: 15, km: 58 },
    { nome: "Castiglione del Genovesi", tempoDaPrecedente: 20, km: 75 },
    { nome: "San Cipriano Picentino", tempoDaPrecedente: 15, km: 82 }
];

/**
 * Funzione per attivare il menù a tendina con autocompletamento su un campo di input
 */
function setupAutocomplete(inputElement) {
    const wrapper = inputElement.closest('.search-input-wrapper');
    if (!wrapper) return;

    inputElement.setAttribute('autocomplete', 'off');

    // Funzione per mostrare/aggiornare il menu a tendina
    function mostraTendina(filtro = '') {
        closeAllAutocompleteLists();

        const listContainer = document.createElement('div');
        listContainer.classList.add('autocomplete-list');
        wrapper.appendChild(listContainer);

        // Se il filtro è vuoto prende tutte le località, altrimenti filtra
        const corrispondenze = databaseLocalita.filter(item =>
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

            // Selezione della voce
            itemDiv.addEventListener('mousedown', function (e) {
                e.preventDefault(); // Previene il blur dell'input prima del click
                inputElement.value = item.nome;
                closeAllAutocompleteLists();
            });

            listContainer.appendChild(itemDiv);
        });
    }

    // Mostra tutte le località al click o al focus
    inputElement.addEventListener('focus', function () {
        mostraTendina(this.value.trim());
    });

    inputElement.addEventListener('click', function () {
        mostraTendina(this.value.trim());
    });

    // Filtra durante la digitazione
    inputElement.addEventListener('input', function () {
        mostraTendina(this.value.trim());
    });
}

/**
 * Rimuove tutti i menù a tendina aperti nel DOM
 */
function closeAllAutocompleteLists() {
    const liste = document.querySelectorAll('.autocomplete-list');
    liste.forEach(lista => lista.remove());
}

// Chiusura al click esterno
document.addEventListener('click', function (e) {
    if (!e.target.closest('.search-input-wrapper')) {
        closeAllAutocompleteLists();
    }
});

/**
 * Estrae il segmento di tappe e assegna a ciascuna tappa il tempo di percorrenza singolo
 */
function calcolaSequenzaItinerario(partenza, arrivo) {
    const normalize = str => str.trim().toLowerCase();

    const startIndex = databaseLocalita.findIndex(item => normalize(item.nome) === normalize(partenza));
    const endIndex = databaseLocalita.findIndex(item => normalize(item.nome) === normalize(arrivo));

    if (startIndex === -1 || endIndex === -1) {
        return null;
    }

    let segmento = [];
    let versoAvanti = true;

    if (startIndex <= endIndex) {
        segmento = databaseLocalita.slice(startIndex, endIndex + 1);
        versoAvanti = true;
    } else {
        segmento = databaseLocalita.slice(endIndex, startIndex + 1).reverse();
        versoAvanti = false;
    }

    const kmIniziali = segmento[0].km;

    return segmento.map((tappa, idx) => {
        let tempoTratta = 0;

        if (idx === 0) {
            tempoTratta = 0;
        } else {
            tempoTratta = versoAvanti ? tappa.tempoDaPrecedente : segmento[idx - 1].tempoDaPrecedente;
        }

        return {
            nome: tappa.nome,
            tempo: `${tempoTratta} min`,
            distanza: `${Math.abs(tappa.km - kmIniziali)} km`
        };
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-creazione-itinerario');
    const propostoBox = document.getElementById('itinerario-proposto-box');
    const btnGenera = document.querySelector('.btn-genera');
    const btnReset = document.getElementById('btn-reset');

    const inputTitolo = document.getElementById('itinerario-titolo');
    const inputPartenza = document.getElementById('itinerario-partenza');
    const inputArrivo = document.getElementById('itinerario-arrivo');

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

            if (tappa.isEditing) {
                tappaElement.innerHTML = `
                    <input type="text" class="tappa-edit-input edit-nome" value="${tappa.nome}" placeholder="Luogo">
                    <input type="text" class="tappa-edit-input edit-tempo" value="${tappa.tempo}" placeholder="Tempo tratta (es. 10 min)">
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
                tappaElement.innerHTML = `
                    <div class="tappa-chip">${tappa.nome}</div>
                    <div class="tappa-chip">${tappa.tempo}</div>
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
                tappeItinerario[index].isEditing = true;
                renderTappe();
                return;
            }

            const btnConferma = e.target.closest('.btn-conferma-edit');
            if (btnConferma) {
                const index = parseInt(btnConferma.dataset.index, 10);
                const parentRow = btnConferma.closest('.tappa-item');

                const valNome = parentRow.querySelector('.edit-nome').value.trim();
                const valTempo = parentRow.querySelector('.edit-tempo').value.trim();
                const valDistanza = parentRow.querySelector('.edit-distanza').value.trim();

                if (valNome) tappeItinerario[index].nome = valNome;
                if (valTempo) tappeItinerario[index].tempo = valTempo;
                if (valDistanza) tappeItinerario[index].distanza = valDistanza;

                tappeItinerario[index].isEditing = false;
                renderTappe();
                return;
            }

            const btnAnnulla = e.target.closest('.btn-annulla-edit');
            if (btnAnnulla) {
                const index = parseInt(btnAnnulla.dataset.index, 10);
                tappeItinerario[index].isEditing = false;
                renderTappe();
                return;
            }
        });
    }

    if (btnReset) {
        btnReset.addEventListener('click', () => {
            tappeItinerario = [];
            if (form) form.reset();
            closeAllAutocompleteLists();
            renderTappe();
        });
    }

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            if (tappeItinerario.length === 0) {
                alert('Genera prima un itinerario valido.');
                return;
            }

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