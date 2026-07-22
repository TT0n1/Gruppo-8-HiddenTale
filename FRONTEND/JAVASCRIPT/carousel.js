document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('carouselTrack');
    const container = document.getElementById('carouselContainer');

    if (typeof databaseEventi === 'undefined') {
        console.error("Errore: databaseEventi non trovato.");
        return;
    }

    // 1. Popolamento dinamico del carosello
    let eventiArray = Array.isArray(databaseEventi)
        ? databaseEventi
        : Object.keys(databaseEventi).map(key => ({ id: key, ...databaseEventi[key] }));

    track.innerHTML = '';

    eventiArray.forEach(dati => {
        const idEvento = dati.id || '';
        const titoloEvento = dati.titolo || dati.nome || 'Evento senza nome';
        const immagineEvento = dati.immagineLocandina || dati.immagine || dati.img || '../IMAGES/placeholder.jpg';
        const provinciaEvento = dati.provincia ? ` - ${dati.provincia}` : '';

        // Creazione della card come link per rimandare alla pagina specifica (opzionale, basato sul tuo sistema)
        const cardLink = document.createElement('a');
        cardLink.href = `evento.html?id=${idEvento}`;
        cardLink.className = 'event-card';
        cardLink.style.textDecoration = 'none';
        cardLink.style.color = 'inherit';

        cardLink.innerHTML = `
            <div class="card-image-box">
                <img src="${immagineEvento}" alt="${titoloEvento}">
            </div>
            <p class="card-title">${titoloEvento}${provinciaEvento}</p>
        `;

        track.appendChild(cardLink);
    });

    // 2. Logica originale del carosello
    const originalCards = Array.from(track.children);
    const originalCount = originalCards.length;

    let currentIndex = 0;
    let autoScrollInterval;
    let isTransitioning = false;

    // Se non ci sono eventi, interrompi lo script del carosello
    if (originalCount === 0) return;

    function setupClones() {
        const visibleCards = getVisibleCardsCount();
        for (let i = 0; i < visibleCards; i++) {
            if (originalCards[i]) {
                const clone = originalCards[i].cloneNode(true);
                clone.classList.add('clone');
                track.appendChild(clone);
            }
        }
    }

    function getVisibleCardsCount() {
        if (window.innerWidth <= 480) return 1;
        if (window.innerWidth <= 768) return 2;
        return 3;
    }

    function moveNext() {
        if (isTransitioning) return;
        isTransitioning = true;

        currentIndex++;

        const firstCard = originalCards[0];
        const cardWidth = firstCard.getBoundingClientRect().width;
        const gap = 15;
        const moveDistance = (cardWidth + gap) * currentIndex;

        track.style.transition = 'transform 0.5s ease-in-out';
        track.style.transform = `translateX(-${moveDistance}px)`;
    }

    track.addEventListener('transitionend', () => {
        if (currentIndex >= originalCount) {
            track.style.transition = 'none';
            currentIndex = 0;
            track.style.transform = `translateX(0px)`;
            track.offsetHeight;
        }
        isTransitioning = false;
    });

    function startAutoScroll() {
        autoScrollInterval = setInterval(moveNext, 3000);
    }

    function stopAutoScroll() {
        clearInterval(autoScrollInterval);
    }

    setupClones();
    startAutoScroll();

    container.addEventListener('mouseenter', stopAutoScroll);
    container.addEventListener('mouseleave', startAutoScroll);

    window.addEventListener('resize', () => {
        const firstCard = originalCards[0];
        const cardWidth = firstCard.getBoundingClientRect().width;
        const gap = 15;
        track.style.transition = 'none';
        track.style.transform = `translateX(-${(cardWidth + gap) * currentIndex}px)`;
    });
});