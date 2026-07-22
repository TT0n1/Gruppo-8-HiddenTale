document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.informazioni-form-container');
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
    let localitaInSessione = JSON.parse(sessionStorage.getItem('localitaUtente')) || [];

    // Se c'è un editId, cerca la località e precompila il form
    if (editId) {
        let localitaDaModificare = localitaInSessione.find(l => l.id === editId);

        // Cerca nel database statico (se presente) se non trovato in sessione
        if (!localitaDaModificare && typeof databaseLocalita !== 'undefined') {
            localitaDaModificare = databaseLocalita[editId] || (Array.isArray(databaseLocalita) ? databaseLocalita.find(l => l.id == editId) : null);
        }

        if (localitaDaModificare) {
            document.getElementById('nome').value = localitaDaModificare.nome || '';
            document.getElementById('informazione').value = localitaDaModificare.informazione || localitaDaModificare.descrizione || '';

            // Ripristina l'immagine se presente
            const imgSalvata = localitaDaModificare.immagine || localitaDaModificare.img || localitaDaModificare.immagineLocandina;
            if (imgSalvata && imgSalvata !== '../IMAGES/placeholder.jpg') {
                immagineBase64 = imgSalvata;
                imageUploadBox.innerHTML = `<img src="${immagineBase64}" alt="Preview" style="width: 100%; height: 100%; object-fit: cover; border-radius: inherit;">`;
            }

            if (submitButton) submitButton.textContent = 'Salva Modifiche';
            modalConferma.querySelector('h2').textContent = 'Informazioni Aggiornate!';
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
            id: editId ? editId : 'localita_user_' + Date.now(),
            nome: document.getElementById('nome').value,
            informazione: document.getElementById('informazione').value,
            immagine: immagineBase64 || '../IMAGES/placeholder.jpg'
        };

        if (editId) {
            const index = localitaInSessione.findIndex(l => l.id === editId);
            if (index !== -1) {
                localitaInSessione[index] = datiSalvati;
            } else {
                localitaInSessione.push(datiSalvati);
            }
        } else {
            localitaInSessione.push(datiSalvati);
        }

        sessionStorage.setItem('localitaUtente', JSON.stringify(localitaInSessione));
        modalConferma.style.display = 'flex';
    });

    btnConfermaModal.addEventListener('click', () => {
        // Modifica "listalocalita.html" o "localita.html" in base ai nomi reali delle tue pagine
        window.location.href = editId ? `localita.html?id=${editId}` : 'listalocalita.html';
    });
});