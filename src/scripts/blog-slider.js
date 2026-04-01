export function initBlogSlider() {
    const track = document.getElementById('blog-track');
    const prevBtn = document.getElementById('blog-prev');
    const nextBtn = document.getElementById('blog-next');
    
    if (!track || !prevBtn || !nextBtn) return;

    let currentIndex = 0;
    const cards = track.querySelectorAll('.blog-card');
    const totalCards = cards.length;

    function getVisibleCards() {
        const width = window.innerWidth;
        if (width > 1024) return 3;
        if (width > 768) return 2;
        return 1;
    }

    function updateSlider() {
        const visibleCards = getVisibleCards();
        const maxIndex = totalCards - visibleCards;
        
        if (currentIndex > maxIndex) currentIndex = maxIndex;
        if (currentIndex < 0) currentIndex = 0;

        const cardWidth = cards[0].offsetWidth;
        const gap = 20; // Coincide con CSS
        const offset = currentIndex * (cardWidth + gap);
        
        track.style.transform = `translateX(-${offset}px)`;

        // Update buttons
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= maxIndex;
    }

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
        }
    });

    nextBtn.addEventListener('click', () => {
        const visibleCards = getVisibleCards();
        if (currentIndex < (totalCards - visibleCards)) {
            currentIndex++;
            updateSlider();
        }
    });

    window.addEventListener('resize', updateSlider);
    updateSlider();
}
