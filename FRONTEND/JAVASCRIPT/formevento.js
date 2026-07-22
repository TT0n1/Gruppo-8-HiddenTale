document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.evento-form-container');
    const imageUploadBox = document.querySelector('.image-upload-box');
    const modalConferma = document.getElementById('modal-conferma');
    const btnConfermaModal = document.getElementById('btn-conferma-modal');
    const submitButton = form.querySelector('button[type="submit"]');

    // Controlla se siamo in modalità modifica leggendo l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('editId');

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);

    let immagineBase64 = '';
    let eventiInSessione = JSON.parse(sessionStorage.getItem('eventiUtente')) || [];

    // Se c'è un editId, cerca l'evento e precompila il form
    if (editId) {
        let eventoDaModificare = eventiInSessione.find(e => e.id === editId);

        // Se l'evento non è in sessione, prova a cercarlo nel database statico (se importato nella pagina)
        if (!eventoDaModificare && typeof databaseEventi !== 'undefined') {
            eventoDaModificare = databaseEventi[editId] || (Array.isArray(databaseEventi) ? databaseEventi.find(e => e.id == editId) : null);
        }

        if (eventoDaModificare) {
            // Popola i campi input
            document.getElementById('titolo').value = eventoDaModificare.titolo || eventoDaModificare.nome || '';
            document.getElementById('luogo').value = eventoDaModificare.luogo || eventoDaModificare.indirizzo || '';
            document.getElementById('data-inizio').value = eventoDaModificare.dataInizio || '';
            document.getElementById('data-fine').value = eventoDaModificare.dataFine || '';
            document.getElementById('posti').value = eventoDaModificare.posti === 'Illimitati' ? '' : (eventoDaModificare.posti || '');
            document.getElementById('prezzo').value = isNaN(eventoDaModificare.prezzo) ? '' : eventoDaModificare.prezzo;
            document.getElementById('descrizione').value = eventoDaModificare.descrizione || '';

            // Ripristina l'immagine se presente
            const imgSalvata = eventoDaModificare.immaginePrincipale || eventoDaModificare.immagineLocandina;
            if (imgSalvata && imgSalvata !== '../IMAGES/placeholder.jpg') {
                immagineBase64 = imgSalvata;
                imageUploadBox.innerHTML = `<img src="${immagineBase64}" alt="Preview" style="width: 100%; height: 100%; object-fit: cover; border-radius: inherit;">`;
            }

            // Cambia i testi per indicare la modifica
            if (submitButton) submitButton.textContent = 'Salva Modifiche';
            modalConferma.querySelector('h2').textContent = 'Evento Aggiornato!';
            modalConferma.querySelector('p').textContent = 'Le modifiche sono state salvate con successo.';
        }
    }

    imageUploadBox.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                immagineBase64 = e.target.result;
                imageUploadBox.innerHTML = `<img src="${immagineBase64}" alt="Preview" style="width: 100%; height: 100%; object-fit: cover; border-radius: inherit;">`;
            };
            reader.readAsDataURL(file);
        }
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const datiSalvati = {
            id: editId ? editId : 'evento_user_' + Date.now(),
            titolo: document.getElementById('titolo').value,
            luogo: document.getElementById('luogo').value,
            dataInizio: document.getElementById('data-inizio').value,
            dataFine: document.getElementById('data-fine').value,
            posti: document.getElementById('posti').value,
            prezzo: document.getElementById('prezzo').value,
            descrizione: document.getElementById('descrizione').value,
            immaginePrincipale: immagineBase64 || '../IMAGES/placeholder.jpg'
        };

        if (editId) {
            // Trova l'indice se esiste già in sessione e sovrascrive
            const index = eventiInSessione.findIndex(e => e.id === editId);
            if (index !== -1) {
                eventiInSessione[index] = datiSalvati;
            } else {
                eventiInSessione.push(datiSalvati);
            }
        } else {
            // Aggiunge un nuovo evento
            eventiInSessione.push(datiSalvati);
        }

        sessionStorage.setItem('eventiUtente', JSON.stringify(eventiInSessione));
        modalConferma.style.display = 'flex';
    });

    btnConfermaModal.addEventListener('click', () => {
        window.location.href = editId ? `evento.html?id=${editId}` : 'listaeventi.html';
    });
});