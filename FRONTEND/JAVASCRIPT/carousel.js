const track = document.getElementById('carouselTrack');
const container = document.getElementById('carouselContainer');
const originalCards = Array.from(track.children);
const originalCount = originalCards.length;

let currentIndex = 0;
let autoScrollInterval;
let isTransitioning = false;

// 1. Clona le prime schede in base a quante sono visibili a schermo
function setupClones() {
    const visibleCards = getVisibleCardsCount();
    for (let i = 0; i < visibleCards; i++) {
        const clone = originalCards[i].cloneNode(true);
        clone.classList.add('clone');
        track.appendChild(clone);
    }
}

function getVisibleCardsCount() {
    if (window.innerWidth <= 480) return 1;
    if (window.innerWidth <= 768) return 2;
    return 3;
}

// 2. Funzione di avanzamento
function moveNext() {
    if (isTransitioning) return;
    isTransitioning = true;

    currentIndex++;

    const firstCard = originalCards[0];
    const cardWidth = firstCard.getBoundingClientRect().width;
    const gap = 15; // Stesso gap impostato nel CSS
    const moveDistance = (cardWidth + gap) * currentIndex;

    track.style.transition = 'transform 0.5s ease-in-out';
    track.style.transform = `translateX(-${moveDistance}px)`;
}

// 3. Gestione del reset invisibile al termine dell'animazione
track.addEventListener('transitionend', () => {
    // Quando si raggiunge la fine della lista originale (e si stanno mostrando i cloni)
    if (currentIndex >= originalCount) {
        // Disattiva la transizione per effettuare lo "swap" in modo invisibile
        track.style.transition = 'none';
        currentIndex = 0;
        track.style.transform = `translateX(0px)`;

        // Forza il reflow del browser per applicare subito il cambio posizione
        track.offsetHeight;
    }

    isTransitioning = false;
});

function startAutoScroll() {
    autoScrollInterval = setInterval(moveNext, 3000); // Scorre ogni 3 secondi
}

function stopAutoScroll() {
    clearInterval(autoScrollInterval);
}

// Inizializzazione
setupClones();
startAutoScroll();

// Pausa/Ripresa al passaggio del mouse
container.addEventListener('mouseenter', stopAutoScroll);
container.addEventListener('mouseleave', startAutoScroll);

// Mantiene la posizione corretta in caso di ridimensionamento della pagina
window.addEventListener('resize', () => {
    const firstCard = originalCards[0];
    const cardWidth = firstCard.getBoundingClientRect().width;
    const gap = 15;
    track.style.transition = 'none';
    track.style.transform = `translateX(-${(cardWidth + gap) * currentIndex}px)`;
});