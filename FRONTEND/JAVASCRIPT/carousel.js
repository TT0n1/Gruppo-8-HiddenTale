document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const container = document.getElementById('carouselContainer');

    if (!track) return;

    let currentIndex = 0;
    let autoPlayTimer = null;
    let isTransitioning = false;

    // Popola il carosello dal database eventi
    if (typeof databaseEventi !== 'undefined') {
        track.innerHTML = '';
        Object.keys(databaseEventi).forEach(key => {
            const evento = databaseEventi[key];
            const card = document.createElement('div');
            card.className = 'event-card';
            card.innerHTML = `
                <a href="evento.html?id=${key}" style="text-decoration:none; width:100%;">
                    <div class="card-image-box">
                        <img src="${evento.immagineLocandina || '../IMAGES/placeholder.jpg'}" alt="${evento.nome || evento.titolo}">
                    </div>
                    <div class="card-title">${evento.nome || evento.titolo}</div>
                </a>
            `;
            track.appendChild(card);
        });
    }

    const originalCards = Array.from(track.querySelectorAll('.event-card'));
    const totalOriginals = originalCards.length;

    if (totalOriginals === 0) return;

    function getVisibleCardsCount() {
        if (window.innerWidth <= 600) return 1;
        return 3;
    }

    // Aggiunge o rimuove i cloni necessari per il loop infinito
    function setupClones() {
        // Rimuove vecchi cloni se presenti
        track.querySelectorAll('.event-card.clone').forEach(clone => clone.remove());

        const visibleCards = getVisibleCardsCount();

        // Clona i primi 'visibleCards' elementi e li mette alla fine
        for (let i = 0; i < visibleCards; i++) {
            const clone = originalCards[i % totalOriginals].cloneNode(true);
            clone.classList.add('clone');
            track.appendChild(clone);
        }
    }

    setupClones();

    function getCardWidth() {
        const allCards = track.querySelectorAll('.event-card');
        if (allCards.length === 0) return 0;
        return allCards[0].getBoundingClientRect().width + 15; // Width + gap (15px)
    }

    function updateCarousel(animate = true) {
        const cardWidth = getCardWidth();
        if (animate) {
            track.style.transition = 'transform 0.4s ease-in-out';
        } else {
            track.style.transition = 'none';
        }
        track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
    }

    // Gestione del ripristino istantaneo al termine della transizione
    track.addEventListener('transitionend', () => {
        isTransitioning = false;

        // Se si è arrivati al blocco clonato oltre la fine, salta a 0 senza animazione
        if (currentIndex >= totalOriginals) {
            currentIndex = 0;
            updateCarousel(false);
        }
        // Se si è andati indietro da 0, salta alla fine originale senza animazione
        else if (currentIndex < 0) {
            currentIndex = totalOriginals - 1;
            updateCarousel(false);
        }
    });

    function nextSlide() {
        if (isTransitioning) return;
        isTransitioning = true;
        currentIndex++;
        updateCarousel(true);
    }

    function prevSlide() {
        if (isTransitioning) return;
        isTransitioning = true;

        // Se siamo all'inizio (0) e premiamo indietro, saltiamo prima all'equivalente clonato
        if (currentIndex === 0) {
            currentIndex = totalOriginals;
            updateCarousel(false);
            // Forza il reflow per applicare subito il posizionamento prima di scorrere indietro
            track.offsetHeight;
        }

        currentIndex--;
        updateCarousel(true);
    }

    // --- GESTIONE AUTOPLAY (Scorrimento Automatico) ---
    function startAutoPlay() {
        stopAutoPlay();
        autoPlayTimer = setInterval(nextSlide, 3500); // Scorre ogni 3.5 secondi
    }

    function stopAutoPlay() {
        if (autoPlayTimer) clearInterval(autoPlayTimer);
    }

    // Eventi pulsanti
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            startAutoPlay(); // Resetta il timer dell'autoplay dopo il click
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            startAutoPlay(); // Resetta il timer dell'autoplay dopo il click
        });
    }

    // Mette in pausa l'autoplay se l'utente va sopra col mouse
    if (container) {
        container.addEventListener('mouseenter', stopAutoPlay);
        container.addEventListener('mouseleave', startAutoPlay);
    }

    window.addEventListener('resize', () => {
        setupClones();
        updateCarousel(false);
    });

    // Avvio iniziale
    updateCarousel(false);
    startAutoPlay();
});