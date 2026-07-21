// Array locale per tracciare le tappe prima di salvare
let tappeItinerario = [];

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-creazione-itinerario');
    const propostoBox = document.querySelector('.proposto-box');
    const btnReset = document.getElementById('btn-reset');

    // Funzione per aggiornare la vista delle tappe
    function renderTappe() {
        propostoBox.innerHTML = ''; // Pulisce il contenitore

        tappeItinerario.forEach((tappa, index) => {
            const tappaElement = document.createElement('div');
            tappaElement.classList.add('tappa-item');
            tappaElement.innerHTML = `
                <span>${index + 1}. ${tappa.nome} (${tappa.orario})</span>
                <div class="tappa-actions">
                    <button type="button" class="btn-edit" data-index="${index}" style="color: #B59652;">✏️</button>
                    <button type="button" class="btn-delete" data-index="${index}" style="color: #C23305;">✕</button>
                </div>
            `;
            propostoBox.appendChild(tappaElement);
        });
    }

    // Gestione dei click su modifica ed elimina (Event Delegation)
    propostoBox.addEventListener('click', (e) => {
        const index = e.target.dataset.index;
        if (e.target.classList.contains('btn-delete')) {
            tappeItinerario.splice(index, 1);
            renderTappe();
        } else if (e.target.classList.contains('btn-edit')) {
            const nuovoNome = prompt('Modifica il nome della tappa:', tappeItinerario[index].nome);
            if (nuovoNome) {
                tappeItinerario[index].nome = nuovoNome;
                renderTappe();
            }
        }
    });

    // Reset del form
    btnReset.addEventListener('click', () => {
        tappeItinerario = [];
        form.reset();
        renderTappe();
    });

    // Salva itinerario in localStorage
    // Salva itinerario in localStorage
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const inputTitolo = document.getElementById('itinerario-titolo');
        const inputPartenza = document.getElementById('itinerario-partenza');
        const inputArrivo = document.getElementById('itinerario-arrivo');

        const nuovoItinerario = {
            id: Date.now(),
            titolo: inputTitolo ? inputTitolo.value : 'Senza Titolo',
            partenza: inputPartenza ? inputPartenza.value : '',
            arrivo: inputArrivo ? inputArrivo.value : '',
            tappe: tappeItinerario
        };

        // Salvataggio nel localStorage
        const esistenti = JSON.parse(localStorage.getItem('itinerari')) || [];
        esistenti.push(nuovoItinerario);
        localStorage.setItem('itinerari', JSON.stringify(esistenti));

        // Gestione Modal invece dell'alert
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
            // Fallback nel caso in cui la modal non sia presente
            alert('Itinerario salvato con successo!');
            window.location.href = 'itinerari.html';
        }
    });
}
});